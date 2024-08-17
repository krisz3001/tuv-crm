import { inject, Injectable } from '@angular/core';
import { Offer, OffersWithYears } from '../interfaces/offer.interface';
import { Observable, from, of } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { addDoc, collection, collectionData, doc, DocumentReference, Firestore, getDoc, orderBy, query, setDoc, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  errorHandler = inject(ErrorHandlerService);
  firestore = inject(Firestore);

  offers = collection(this.firestore, 'offers');

  getOffers(): Observable<Offer[]> {
    return collectionData(query(this.offers, orderBy('year'), orderBy('id')), { idField: 'firebaseId' }) as Observable<Offer[]>;
  }

  getClientOffers(clientId: string): Observable<Offer[]> {
    return collectionData(query(this.offers, where('clientId', '==', clientId), orderBy('year'), orderBy('id')), { idField: 'firebaseId' }) as Observable<Offer[]>;
  }

  getFilteredOffers(year: number): Observable<Offer[]> {
    return of([]);
  }

  getOffer(firebaseId: string): Observable<Offer> {
    const docRef = doc(this.offers, firebaseId);
    const promise = getDoc(docRef).then((res) => res.data() as Offer);
    return from(promise);
  }

  postOffer(offer: Offer): Observable<DocumentReference> {
    const promise = addDoc(this.offers, offer);
    return from(promise);
  }

  patchOffer(offer: Offer): Observable<Offer | void> {
    const docRef = doc(this.firestore, 'offers', offer.firebaseId);
    const promise = setDoc(docRef, offer, { merge: true })
      .then(() => offer)
      .catch((error) => this.errorHandler.handleError(error));
    return from(promise);
  }

  getOffersWithYears(offers: Offer[]): OffersWithYears {
    return {
      years: offers.map((offer) => offer.year).filter((year, index, self) => self.indexOf(year) === index),
      offers,
    };
  }
}
