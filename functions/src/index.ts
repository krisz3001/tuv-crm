/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/* import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger'; */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

async function assignTimestamps(snap: functions.firestore.DocumentSnapshot) {
  const newDocumentRef = snap.ref;

  await db.runTransaction(async (transaction) => {
    transaction.update(newDocumentRef, { firebaseId: snap.id, createdAt: snap.createTime, updatedAt: snap.createTime });
  });
}

async function handleDocumentUpdate(change: functions.Change<functions.firestore.QueryDocumentSnapshot>) {
  const updatedDocumentRef = change.after.ref;
  if (change.before.data().updatedAt !== change.after.data().updatedAt) {
    return;
  }

  await db.runTransaction(async (transaction) => {
    transaction.update(updatedDocumentRef, { updatedAt: change.after.updateTime });
  });
}

export const handleClientCreate = functions.firestore.document('clients/{clientId}').onCreate(async (snap, context) => {
  await assignTimestamps(snap);
});

export const handleClientUpdate = functions.firestore.document('clients/{clientId}').onUpdate(handleDocumentUpdate);
export const handleOfferUpdate = functions.firestore.document('offers/{offerId}').onUpdate(handleDocumentUpdate);

export const assignOfferId = functions.firestore.document('offers/{offerId}').onCreate(async (snap, context) => {
  const newOfferRef = snap.ref;
  const counterRef = db.collection('counters').doc('offerCounter');

  const currentYear = new Date().getFullYear();

  await db.runTransaction(async (transaction) => {
    await assignTimestamps(snap);
    const counterDoc = await transaction.get(counterRef);

    if (!counterDoc.exists) {
      transaction.set(counterRef, { [currentYear]: 0 });
    }

    const currentId = counterDoc.data()?.[currentYear] || 0;
    const newId = currentId + 1;
    transaction.update(counterRef, { [currentYear]: newId });
    transaction.update(newOfferRef, { year: currentYear, id: newId });
  });
});
