import { StorageReference } from '@angular/fire/storage';

export interface File {
  name: string;
  path: string;
  ref: StorageReference;
}
