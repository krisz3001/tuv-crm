import { Client } from './client.interface';
import { File } from './file.interface';

export interface Document {
  id: number;
  year: number;
  files: File[];
  clientID: string;
  createdAt: string;
  updatedAt: string;
}
