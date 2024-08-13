import { Document } from './document.interface';

export interface Certificate extends Document {
  name: string;
  expiration: string;
  ped: boolean;
  weldingDate: string;
  manufacturer: string;
}
