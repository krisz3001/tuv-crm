import * as fs from 'fs';
import { createReport } from 'docx-templates';
import * as logger from 'firebase-functions/logger';
import { db } from '.';
import { assignTimestamps } from './timestamps';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { Offer } from './interfaces';

// Generates a DOCX file for the offer
export async function generateDocx(offer: Offer) {
  const template = fs.readFileSync('templates/offer.docx');

  const buffer = await createReport({
    template,
    cmdDelimiter: ['{{', '}}'],
    data: {
      id: offer.id.toString().padStart(3, '0'),
      year: offer.year,
      subject: offer.subject,
      contact: offer.client.contact,
      offers: offer.options,
      total: offer.price,
    },
  });

  const bucket = getStorage().bucket();
  const file = bucket.file(`${offer.clientId}/offers/${offer.firebaseId}/${offer.id.toString().padStart(3, '0')}_${offer.year}_${offer.client.company}_ajánlat.docx`);
  await file.save(buffer);
}

// Manages the creation of a new offer: sets the year and id and issues the generation of the DOCX file
export async function createOffer(snap: DocumentSnapshot) {
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
    transaction.update(newOfferRef, { firebaseId: snap.id, year: currentYear, id: newId, accepted: null });

    const offer = snap.data() as Offer;
    offer.year = currentYear;
    offer.id = newId;
    offer.firebaseId = snap.id;

    await generateDocx(offer as Offer);
  });
}
