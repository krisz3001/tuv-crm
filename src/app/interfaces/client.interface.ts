import { QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';
import { Certificate } from './certificate.interface';
import { Contract } from './contract.interface';
import { Offer } from './offer.interface';

export interface Client {
  firebaseId: string;
  company: string;
  contact: string;
  offers: Offer[];
  contracts: Contract[];
  certificates: Certificate[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ClientPage {
  clients: Client[];
  lastDoc: QueryDocumentSnapshot | null;
}
