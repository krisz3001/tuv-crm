import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db } from '.';
import { Change } from 'firebase-functions/v1';

// These functions control the timestamps on documents

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
