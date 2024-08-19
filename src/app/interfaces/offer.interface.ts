import { Client } from './client.interface';
import { Contract } from './contract.interface';
import { Document } from './document.interface';

export interface Offer extends Document {
  subject: string;
  commonAdvisor: string;
  expert: string;
  price: number;
  client: Client;
  accepted: boolean | null;
  contract: Contract | null;
  options: OfferOption[];
  comment: string;
  initialFilePath?: string;
}

export interface OffersWithYears {
  offers: Offer[];
  years: number[];
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
