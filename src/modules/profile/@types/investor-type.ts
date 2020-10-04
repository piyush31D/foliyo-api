export interface IInvestor {
  user: string;
  firstName: string;
  lastName: string;
  gender: string;
  picture: string;
  mobile: string;
  email: string;
  residence: string;
  occupationDetails: IOccupation;
  fathersName: string;
  mothersName: string;
  pan: string;
  nomineeDetails: INominee[];
  riskAnalysis: string[]
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