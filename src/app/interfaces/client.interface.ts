import { QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';
import { CertificateBTI } from './certificate-bti.interface';
import { Contract } from './contract.interface';
import { Offer } from './offer.interface';

export interface Client {
  firebaseId: string;
  company: string;
  contact: string;
  offers: Offer[];
  contracts: Contract[];
  certificates: CertificateBTI[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ClientPage {
  clients: Client[];
  lastDoc: QueryDocumentSnapshot | null;
}
