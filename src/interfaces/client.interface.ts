import { Certificate } from './certificate.interface';
import { Contract } from './contract.interface';
import { Offer } from './offer.interface';

export interface Client {
  id: string;
  company: string;
  contact: string;
  offers: Offer[];
  contracts: Contract[];
  certificates: Certificate[];
  createdAt: string;
  updatedAt: string;
}
