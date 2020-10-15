import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Advisor } from '../models/advisor-profile.model';
import logger from '../../../winston';
import { IAdvisor } from '../@types/advisor-type';
import { addRemoveInvestorsToGroupSchema, createAdvisorSchema, createInvestorGroupSchema, updateInvestorGroupSchema } from '../validators/advisor';
import {
  ADVISOR_CREATE_SUCCESS,
  ADVISOR_INVESTOR_ACCESS_ERROR,
  ADVISOR_PROFILE_EXISTS,
  GROUP_ADD_INVESTOR_SUCCESS,
  GROUP_CREATE_SUCCESS,
  GROUP_DELETE_SUCCESS,
  GROUP_NOT_FOUND,
  GROUP_REMOVE_INVESTOR_SUCCESS,
  GROUP_UPDATE_SUCCESS
} from '../../../const/profile/profile-message.const';
import APIError from '../../../error';
import { UserProfile } from '../../auth/@types/user.enum';
import User from '../../auth/models/user.model';
import { InvestorSubscription } from '../../../modules/billing/models/investor-subscription.model';
import { advisorIdParamSchema } from '../../../validators/advisor';
import { investorgroupIdParamSchema } from '../validators/common';
import { InvestorGroup } from '../models/investor-group.model';
import { investorIdParamSchema } from '../../../validators/investor';
import { Investor } from '../models/investor-profile.model';

export const getAdvisorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const advisor = await Advisor.findOne({ user: req.user._id });
    const data: { profileExists: boolean, profile?: IAdvisor } = { profileExists: false };
    if (advisor) {
      data.profileExists = true;
      data.profile = advisor;
    }
    return res.json({ success: true, data });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
};



export const createAdvisorProfile = async (req: Request<{}, {}, { investors: string[] }>, res: Response, next: NextFunction) => {
  try {
    await createAdvisorSchema.validateAsync(req.body);
    const advisor = await Advisor.findOne({ user: req.user._id });
    if (advisor)
      throw new APIError(ADVISOR_PROFILE_EXISTS, httpStatus.CONFLICT);
    const newAdvisor = new Advisor(req.body);
    newAdvisor.user = req.user._id;
    const session = await mongoose.startSession();
    session.startTransaction();
    await newAdvisor.save();
    await User.findByIdAndUpdate(mongoose.Types.ObjectId(req.user._id), { $push: { profiles: UserProfile.ADVISOR } });
    await session.commitTransaction();
    session.endSession();
    return res.json({
      success: true,
      data: {
        profileExists: true,
        profile: newAdvisor
      },
      message: ADVISOR_CREATE_SUCCESS
    });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const getInvestorsOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    const investors = await InvestorSubscription.count({});
    return res.json({ success: true, data: { investors } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

type GetInvestorsQuery = {
  name?: string
}

export const getInvestors = async (req: Request<{ advisorId: string }, {}, {}, GetInvestorsQuery>, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const { name } = req.query;
    const query: any[] = [
      { $match: { "advisor": advisorId } },
      { $group: { _id: "$investor", data: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$data" } },
      {
        $lookup: {
          from: "investors",
          localField: "investor",
          foreignField: "_id",
          as: "investor"
        }
      },
      { $unwind: "$investor" }
    ];
    if (name) {
      query.push({ $match: { "investor.fullName": { $regex: new RegExp(`^${name}`, 'i') } } })
    }
    query.push({ $replaceRoot: { newRoot: "$investor" } });
    const investors = await InvestorSubscription.aggregate(query);
    return res.json({ success: true, data: { investors } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const getInvestor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await investorIdParamSchema.validateAsync(req.params);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const investorId = mongoose.Types.ObjectId(req.params.investorId);
    const subscriptions = await InvestorSubscription.find({
      advisor: advisorId,
      investor: investorId
    });
    if (!subscriptions.length) {
      throw new APIError(ADVISOR_INVESTOR_ACCESS_ERROR, httpStatus.FORBIDDEN)
    }
    const investor = await Investor.findOne({
      _id: investorId
    });
    return res.json({ success: true, data: { investor } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const getInvestorGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const groups = await InvestorGroup.find({
      advisor: advisorId,
      user: req.user._id
    })
    return res.json({ success: true, data: { groups } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

interface CreateInvestorGroup {
  name: string;
  investors: string[];
  automatic: boolean;
}

export const createInvestorGroup = async (req: Request<{ advisorId: string }, {}, CreateInvestorGroup>, res: Response, next: NextFunction) => {
  try {
    const { investors, ...rest } = req.body;
    await advisorIdParamSchema.validateAsync(req.params);
    await createInvestorGroupSchema.validateAsync(req.body);
    const { advisorId } = req.params;
    const group = new InvestorGroup({
      ...rest,
      advisor: advisorId,
      user: req.user._id
    });
    if (investors && investors.length) {
      const investorIds = investors.map(investor => mongoose.Types.ObjectId(investor));
      group.investors = investorIds;
      const session = await mongoose.startSession();
      session.startTransaction();
      await group.save();
      await Investor.updateMany({ _id: { $in: investorIds } },
        { $push: { groups: group._id } });
      await session.commitTransaction();
      session.endSession();
    } else {
      await group.save();
    }
    return res.json({ success: true, message: GROUP_CREATE_SUCCESS, data: { group } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const getInvestorGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await investorgroupIdParamSchema.validateAsync(req.params);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const investorgroupId = mongoose.Types.ObjectId(req.params.investorgroupId);
    const group = await InvestorGroup.findOne({
      advisor: advisorId,
      _id: investorgroupId
    }).populate('investors');
    return res.json({ success: true, data: { group } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

export const updateInvestorGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await investorgroupIdParamSchema.validateAsync(req.params);
    await updateInvestorGroupSchema.validateAsync(req.body);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const investorgroupId = mongoose.Types.ObjectId(req.params.investorgroupId);
    const group = await InvestorGroup.findOneAndUpdate({
      _id: investorgroupId,
      advisor: advisorId
    }, { $set: req.body }, { new: true });
    return res.json({ success: true, message: GROUP_UPDATE_SUCCESS, data: { group } });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}


export const deleteInvestorGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await investorgroupIdParamSchema.validateAsync(req.params);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const investorgroupId = mongoose.Types.ObjectId(req.params.investorgroupId);
    const group = await InvestorGroup.findOne({
      advisor: advisorId,
      _id: investorgroupId
    });
    if (!group) {
      throw new APIError(GROUP_NOT_FOUND, httpStatus.NOT_FOUND);
    }
    await InvestorGroup.findOneAndRemove({
      _id: investorgroupId,
      advisor: advisorId
    });
    return res.json({ success: true, message: GROUP_DELETE_SUCCESS });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

type Params = {
  advisorId: string;
  investorgroupId: string;
}
//TODO: Allocate folio if group is part of any folio
export const addInvestorsToGroup = async (req: Request<Params, {}, { investors: string[] }>, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await investorgroupIdParamSchema.validateAsync(req.params);
    await addRemoveInvestorsToGroupSchema.validateAsync(req.body);
    const investors = req.body.investors.map((investor) => mongoose.Types.ObjectId(investor));
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const investorgroupId = mongoose.Types.ObjectId(req.params.investorgroupId);
    const session = await mongoose.startSession();
    session.startTransaction();
    await InvestorGroup.findOneAndUpdate({
      _id: investorgroupId,
      advisor: advisorId
    }, {
      $push: {
        investors: {
          $each: investors
        }
      }
    });
    await Investor.updateMany({ _id: { $in: investors } }, { $push: { groups: investorgroupId } });
    await session.commitTransaction();
    session.endSession();
    return res.json({ success: true, message: GROUP_ADD_INVESTOR_SUCCESS });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}

//TODO: Deallocate folio if group is part of any folio
export const removeInvestorsFromGroup = async (req: Request<Params, {}, { investors: string[] }>, res: Response, next: NextFunction) => {
  try {
    await advisorIdParamSchema.validateAsync(req.params);
    await investorgroupIdParamSchema.validateAsync(req.params);
    await addRemoveInvestorsToGroupSchema.validateAsync(req.body);
    const advisorId = mongoose.Types.ObjectId(req.params.advisorId);
    const investorgroupId = mongoose.Types.ObjectId(req.params.investorgroupId);
    const investors = req.body.investors.map((investor) => mongoose.Types.ObjectId(investor)); const session = await mongoose.startSession();
    session.startTransaction();
    await InvestorGroup.update({
      _id: investorgroupId,
      advisor: advisorId
    }, {
      $pullAll: { investors }
    });
    await Investor.updateMany({ _id: { $in: investors } }, { $pull: { groups: investorgroupId } });
    await session.commitTransaction();
    session.endSession();
    return res.json({ success: true, message: GROUP_REMOVE_INVESTOR_SUCCESS });
  } catch (error) {
    logger.error(error.message);
    return next(error);
  }
}