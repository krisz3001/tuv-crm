import { Timestamp } from '@angular/fire/firestore';
import { Client } from './client.interface';
import { File } from './file.interface';

export interface Document {
  firebaseId: string;
  id: number;
  year: number;
  files: File[];
  clientId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
