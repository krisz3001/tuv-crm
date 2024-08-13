import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OfferCategory } from '../interfaces/offer-category.interface';
import { ErrorHandlerService } from './error-handler.service';
import { OfferPrice } from '../interfaces/offer-price.interface';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) {}

  categories: OfferCategory[] = [];

  getCategories(): Observable<OfferCategory[]> {
    return of([]);
  }

  postCategory(category: OfferCategory): Observable<any> {
    return of(null);
  }

  patchCategory(category: OfferCategory): Observable<any> {
    return of(null);
  }

  deleteCategory(id: number): Observable<any> {
    return of(null);
  }

  postOfferPrice(offerPrice: OfferPrice): Observable<any> {
    return of(null);
  }

  patchOfferPrice(offerPrice: OfferPrice): Observable<any> {
    return of(null);
  }

  deleteOfferPrice(offerPrice: OfferPrice): Observable<any> {
    return of(null);
  }
}
