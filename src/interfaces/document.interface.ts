import { Client } from './client.interface';
import { File } from './file.interface';

export interface Document {
  id: number;
  year: number;
  files: File[];
  clientID: number;
  client: Client;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
