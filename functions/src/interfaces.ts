export interface Client {
  company: string;
  contact: string;
}

export interface Offer {
  firebaseId: string;
  id: number;
  year: number;
  client: Client;
  clientId: string;
  subject: string;
  commonAdvisor: string;
  expert: string;
  price: number;
  accepted: boolean | null;
  options: OfferOption[];
  comment: string;
}

export interface OfferCategory {
  name: string;
  offerOptions: OfferOption[];
}

export interface OfferOption {
  name: string;
  description: string;
  price: number;
}
