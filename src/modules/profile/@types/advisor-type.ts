export interface IAdvisor {
  user: string;
  pan: string;
  regNumber: string;
  authority: string;
  isVerified: boolean;
  picture: string;
  mobile: string;
  email: string;
  residence: string;
  category: AdvisorCategory;
  offerings: string[];
  rating: number;
  individualDetails: IIndividual;
  companyDetails: ICompany;
  address: IAddress[];
};

export interface ICompany {
  name: string;
}

export interface IIndividual {
  firstName: string;
  lastName: string;
  gender: string;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
}

export enum AdvisorCategory {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY"
}