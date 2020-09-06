export interface IAdvisor {
  pan: string;
  regNumber: string;
  authority: string;
  isVerified: boolean;
  picture: string;
  phone: string;
  email: string;
  residence: string;
  category: string;
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