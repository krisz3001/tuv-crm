import { Client } from './client.interface';

export interface Certificate {
  id: number;
  name: string;
  expiration: string;
  clientID: number;
  client: Client;
  ped: boolean;
  weldingDate: string;
  manufacturer: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
