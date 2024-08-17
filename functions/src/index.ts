import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createOffer } from './offers';
import { assignTimestamps, handleDocumentUpdate } from './timestamps';

admin.initializeApp();
export const db = admin.firestore();

// Cloud Functions

// Clients
export const handleClientCreate = functions.firestore.document('clients/{clientId}').onCreate(async (snap, context) => {
  await assignTimestamps(snap);
});

export const handleClientUpdate = functions.firestore.document('clients/{clientId}').onUpdate(handleDocumentUpdate);

// Offers
export const handleOfferCreate = functions.firestore.document('offers/{offerId}').onCreate(createOffer);
export const handleOfferUpdate = functions.firestore.document('offers/{offerId}').onUpdate(handleDocumentUpdate);
