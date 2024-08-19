import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Client, ClientPage } from '../interfaces/client.interface';
import { ErrorHandlerService } from './error-handler.service';
import { deleteDoc, doc, Firestore, getDoc, getDocs, limit, query, setDoc, startAfter, orderBy, QueryDocumentSnapshot } from '@angular/fire/firestore';
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
    let q = query(this.clients, orderBy('createdAt'), limit(lim));
    if (prevDoc) {
      q = query(q, startAfter(prevDoc));
    }
    const promise = getDocs(q)
      .then((res) => {
        const result = {} as ClientPage;
        result.clients = res.docs.map((doc) => doc.data() as Client);
        if (result.clients.length) {
          result.lastDoc = res.docs[res.docs.length - 1];
        }
        return result;
      })
      .catch((error) => {
        this.errorHandler.handleError(error);
        return {} as ClientPage;
      });
    return from(promise);
  }

  getClient(id: string): Observable<Client> {
    const docRef = doc(this.clients, id);
    const promise = getDoc(docRef).then((res) => ({ ...res.data(), firebaseId: id }) as Client);
    return from(promise);
  }

  postClient(client: Client): Observable<void> {
    const clientToCreate: Client = {
      ...client,
    } as Client;

    const promise = addDoc(this.clients, clientToCreate)
      .then(() => {})
      .catch((error) => this.errorHandler.handleError(error));
    return from(promise);
  }

  patchClient(client: Client): Observable<Client | void> {
    const docRef = doc(this.clients, client.firebaseId);
    const promise = setDoc(docRef, client, { merge: true })
      .then(() => client)
      .catch((error) => this.errorHandler.handleError(error));
    return from(promise);
  }

  deleteClient(id: string): Observable<void> {
    const docRef = doc(this.clients, id);
    const promise = deleteDoc(docRef);
    return from(promise);
  }
}
