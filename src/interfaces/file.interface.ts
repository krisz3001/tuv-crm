import { FileType } from '../enums/file-type';

export interface File {
  id: number;
  path: string;
  filename: string;
  type: FileType;
  extension: string;
  createdAt: string;
  updatedAt: string;
}
