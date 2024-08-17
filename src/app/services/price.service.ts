import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { doc, Firestore, onSnapshot, setDoc, Unsubscribe } from '@angular/fire/firestore';
import { OfferCategory } from '../interfaces/offer.interface';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  errorHandler = inject(ErrorHandlerService);
  firestore = inject(Firestore);

  categories = new BehaviorSubject<OfferCategory[]>([]);

  getCategories(): Unsubscribe {
    return onSnapshot(doc(this.firestore, 'offer-categories', 'all'), (doc) => {
      const data = doc.data();
      if (!data) {
        this.categories.next([]);
        return;
      }
      this.categories.next(data['categories'] as OfferCategory[]);
    });
  }

  saveCategories(categories: OfferCategory[]): Observable<any> {
    const ref = doc(this.firestore, 'offer-categories', 'all');
    const promise = setDoc(ref, { categories });
    return from(promise);
  }
}
