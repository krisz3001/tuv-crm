import { Document } from './document.interface';

export interface CertificateHEG extends Document {
  name: string;
  expiration: string;
  ped: boolean;
  weldingDate: string;
  manufacturer: string;
}
