import { inject, Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Client } from '../interfaces/client.interface';
import { ErrorHandlerService } from './error-handler.service';
import { collectionData, deleteDoc, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { addDoc, collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  errorHandler = inject(ErrorHandlerService);
  firestore = inject(Firestore);

  clients = collection(this.firestore, 'clients');

  getClients(): Observable<Client[]> {
    return collectionData(this.clients, { idField: 'id' }) as Observable<Client[]>;
  }

  getClient(id: string): Observable<Client> {
    const docRef = doc(this.firestore, 'clients', id);
    const promise = getDoc(docRef).then((res) => res.data() as Client);
    return from(promise);
  }

  postClient(client: Client): Observable<string> {
    const currTime = new Date().toISOString();
    const clientToCreate = { ...client, createdAt: currTime, updatedAt: currTime };
    const promise = addDoc(this.clients, clientToCreate).then((res) => res.id);
    return from(promise);
  }

  deleteClient(id: string): Observable<void> {
    const docRef = doc(this.firestore, 'clients', id);
    const promise = deleteDoc(docRef);
    return from(promise);
  }
}
