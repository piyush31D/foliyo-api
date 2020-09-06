export interface IInvestor {
  firstName: string;
  lastName: string;
  gender: string;
  picture: string;
  phone: string;
  email: string;
  residence: string;
  occupationDetails: IOccupation;
  fathersName: string;
  mothersName: string;
  pan: string;
  nomineeDetails: INominee[];
  riskAnalysis: []
};

//TODO: add more details to improve risk analysis
export interface IOccupation {
  sector: string;
  salaryRange: string;
}

export interface INominee {
  relation: string;
  fullName: string;
  percentage: number;
}

export interface IGroupCriteria {
  name: string;
  values: string[];
}

export interface IInvestorGroup {
  name: string;
  investors: IInvestor[];
  groupCriterias: IGroupCriteria[];
  autoAddition: boolean;
}