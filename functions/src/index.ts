import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createOffer } from './offers';
import { handleDocumentUpdate } from './timestamps';

admin.initializeApp();
export const db = admin.firestore();

// Cloud Functions

// Clients
export const handleClientCreate = functions
  .region('europe-west1')
  .firestore.document('clients/{clientId}')
  .onCreate(async (snap, context) => {
    await db.runTransaction(async (transaction) => {
      transaction.update(snap.ref, {
        firebaseId: snap.id,
        createdAt: snap.createTime,
        updatedAt: snap.createTime,
      });
    });
  });

export const handleClientUpdate = functions.region('europe-west1').firestore.document('clients/{clientId}').onUpdate(handleDocumentUpdate);

// Offers
export const handleOfferCreate = functions.region('europe-west1').firestore.document('offers/{offerId}').onCreate(createOffer);
export const handleOfferUpdate = functions.region('europe-west1').firestore.document('offers/{offerId}').onUpdate(handleDocumentUpdate);

// Experts
export const onUserRegister = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(async (user, context) => {
    await db.collection('experts').doc(user.uid).set(
      {
        email: user.email,
        firebaseId: user.uid,
        createdAt: context.timestamp,
        updatedAt: context.timestamp,
      },
      { merge: true },
    );
  });
