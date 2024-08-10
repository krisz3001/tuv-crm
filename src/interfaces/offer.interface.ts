import { Contract } from './contract.interface';
import { Document } from './document.interface';
import { File } from './file.interface';

export interface Offer extends Document {
  subject: string;
  commonAdvisor: string;
  expert: string;
  price: number;
  accepted: boolean | null;
  contract: Contract | null;
}

export interface OfferEditor {
  offer: Offer;
  options: OfferOptions[] | null;
  comment: string;
}

export interface OfferOptions {
  id: number;
  categories: number[];
}

export interface OfferCreated {
  offer: Offer;
  file: File;
}

export interface OffersWithYears {
  offers: Offer[];
  years: number[];
}
