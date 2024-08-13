import { inject, Injectable } from '@angular/core';
import { Offer, OfferCreated, OfferEditor, OffersWithYears } from '../interfaces/offer.interface';
import { Observable, Subject, from, of } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { collection, collectionData, Firestore, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  errorHandler = inject(ErrorHandlerService);
  firestore = inject(Firestore);

  offers = collection(this.firestore, 'offers');
  resetFormHotline = new Subject<boolean>();

  getOffers(): Observable<Offer[]> {
    return collectionData(this.offers, { idField: 'id' }) as Observable<Offer[]>;
  }

  getClientOffers(clientId: string): Observable<Offer[]> {
    const promise = getDocs(query(this.offers, where('clientId', '==', clientId))).then((res) => res.docs.map((doc) => doc.data() as Offer));
    return from(promise);
  }

  getFilteredOffers(year: number): Observable<Offer[]> {
    return of([]);
  }

  getOffer(year: number, id: number): Observable<Offer> {
    return of({} as Offer);
  }

  postOffer(offerEditor: OfferEditor): Observable<OfferCreated> {
    return of({} as OfferCreated);
  }

  patchOffer(offerEditor: OfferEditor): Observable<OfferCreated> {
    return of({} as OfferCreated);
  }

  resetCreateForm(): void {
    this.resetFormHotline.next(true);
  }

  getOffersWithYears(offers: Offer[]): OffersWithYears {
    return {
      years: offers.map((offer) => offer.year).filter((year, index, self) => self.indexOf(year) === index),
      offers,
    };
  }
}
