import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db } from '.';
import { Change } from 'firebase-functions/v1';

// These functions control the timestamps on documents

// Assigns createdAt and updatedAt timestamps to a document
export async function assignTimestamps(snap: DocumentSnapshot) {
  const newDocumentRef = snap.ref;

  await db.runTransaction(async (transaction) => {
    transaction.update(newDocumentRef, { firebaseId: snap.id, createdAt: snap.createTime, updatedAt: snap.createTime });
  });
}

// Updates a document's updatedAt timestamp
export async function handleDocumentUpdate(change: Change<QueryDocumentSnapshot>) {
  const updatedDocumentRef = change.after.ref;
  if (change.before.data().updatedAt !== change.after.data().updatedAt) {
    return;
  }

  await db.runTransaction(async (transaction) => {
    transaction.update(updatedDocumentRef, { updatedAt: change.after.updateTime });
  });
}
