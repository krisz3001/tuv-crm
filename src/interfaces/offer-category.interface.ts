import { OfferPrice } from './offer-price.interface';

export interface OfferCategory {
  id: number;
  name: string;
  offerPrices: OfferPrice[];
}
