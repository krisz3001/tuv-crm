import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Client, ClientPage } from '../interfaces/client.interface';
import { ErrorHandlerService } from './error-handler.service';
import {
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  Timestamp,
  startAfter,
  orderBy,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { addDoc, collection } from '@firebase/firestore';
import { OfferService } from './offer.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  errorHandler = inject(ErrorHandlerService);
  firestore = inject(Firestore);
  offerService = inject(OfferService);

  clients = collection(this.firestore, 'clients');

  getClients(lim: number, prevDoc?: QueryDocumentSnapshot): Observable<ClientPage> {
    const result = {} as any;
    let q = query(this.clients, orderBy('createdAt'), limit(lim));
    if (prevDoc) {
      q = query(q, startAfter(prevDoc));
    }
    const promise = getDocs(q).then((res) => {
      result.clients = res.docs.map((doc) => {
        const client = doc.data() as Client;
        client.id = doc.id;
        return client;
      });
      if (result.clients.length) {
        result.lastDoc = res.docs[res.docs.length - 1];
      }
      return result;
    });
    return from(promise);
  }

  getClient(id: string): Observable<Client> {
    const docRef = doc(this.firestore, 'clients', id);
    const promise = getDoc(docRef).then((res) => res.data() as Client);
    return from(promise);
  }

  postClient(client: Client): Observable<string> {
    const currTime = Timestamp.fromDate(new Date());
    const clientToCreate: Client = {
      ...client,
      createdAt: currTime,
      updatedAt: currTime,
    } as Client;
    const promise = addDoc(this.clients, clientToCreate)
      .then((res) => res.id)
      .catch((error) => {
        throw new Error(error.code);
      });
    return from(promise);
  }

  patchClient(client: Client): Observable<Client> {
    const clientToEdit: Client = {
      ...client,
      updatedAt: Timestamp.fromDate(new Date()),
    } as Client;
    const docRef = doc(this.firestore, 'clients', client.id);
    const promise = setDoc(docRef, clientToEdit, { merge: true }).then(() => clientToEdit);
    return from(promise);
  }

  deleteClient(id: string): Observable<void> {
    const docRef = doc(this.firestore, 'clients', id);
    const promise = deleteDoc(docRef);
    return from(promise);
  }
}
