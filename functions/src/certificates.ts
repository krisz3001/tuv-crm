import * as functions from 'firebase-functions';
import mammoth from 'mammoth';
import { HTMLElement, parse } from 'node-html-parser';
import { CertificateBTI } from './interfaces';
import { onCall } from 'firebase-functions/v2/https';

// Certificate parsing cloud function
export const handleParseCertificate = onCall(
  {
    region: 'europe-west1',
  },
  async (data) => {
    const payload = data.data;
    const buffer = Buffer.from(payload.blob, 'base64');

    // Parse the certificate
    const parsed = await parseCertificate(buffer).catch((error) => {
      throw new functions.https.HttpsError('invalid-argument', error.message); // TODO: PROPER ERROR HANDLING
    });

    return parsed;
  },
);

// TODO: ERROR HANDLING
async function parseCertificate(buffer: Buffer): Promise<CertificateBTI> {
  const certificate: CertificateBTI = {
    operator: {},
  } as CertificateBTI;
  return mammoth.convertToHtml({ buffer }).then((res) => {
    const parsed = parse(res.value);
    const table = parsed.querySelector('table')!;
    const rows = table.querySelectorAll('tr');

    // Finding ID
    certificate.id = rows[0].querySelectorAll('td')[1].text;

    // Finding name
    certificate.name = findValueByTitle(rows, 'Megnevezés');

    // Finding danger level
    certificate.dangerLevel = findValueByTitle(rows, 'Veszélyességi');

    // Finding report number
    certificate.reportNumber = findValueByTitle(rows, 'Értékelő jegyzőkönyv száma');

    // Finding operator
    const headerRow = rows.findIndex((row) => row.text.includes('Üzemeltetői adatok'));
    const operatorCells = rows[headerRow + 2].querySelectorAll('td');
    certificate.operator.name = operatorCells[0].text;
    certificate.operator.address = operatorCells[1].text;
    certificate.operator.permissionNumber = operatorCells[2].text;
    certificate.operator.confirmDate = operatorCells[3].text;

    // Finding last visit date
    const rawLastVisitDate = findValueByTitle(rows, 'legutóbbi helyszíni ellenőrzés');
    certificate.lastVisitDate = parseHungarianDate(rawLastVisitDate).getTime();

    // Finding expiration
    const rawExpiration = findValueByTitle(rows, 'tanúsítvány lejártának hatálya');
    certificate.expiration = parseHungarianDate(rawExpiration).getTime();

    return certificate;
  });
}

//* Helper functions

/**
 * Parses date from string in the format of "yyyy. hónapnév dd."
 *
 * @param date Date string
 *
 * @returns Date object
 */
function parseHungarianDate(date: string): Date {
  const [year, month, day] = date.split(' ').map((x) => x.toLowerCase().replace('.', ''));
  const months = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
  const monthIndex = months.findIndex((x) => x === month) + 1;
  return new Date(`${year}-${monthIndex}-${day}`);
}

/**
 * Finds the value in the second cell of a table row by the title in the first cell
 *
 * @param rows Rows of the table
 * @param title The title to search for in the first cell
 *
 * @returns Value of the second cell
 */
function findValueByTitle(rows: HTMLElement[], title: string) {
  let value = '';
  rows.forEach((row) => {
    if (row.text.includes(title)) {
      value = row.querySelectorAll('td')[1].text;
    }
  });
  return value;
}
