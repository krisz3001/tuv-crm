export interface CertificateBTI {
  id: string; // Táblázat első sorának második cellája
  name: string; // A sor ahol a "Megnevezés" szó van az első cellában
  dangerLevel: string; // A sor ahol a "Veszélyességi" szó van az első cellában
  reportNumber: string; // A sor ahol az "Értékelő jegyzőkönyv száma" szó van az első cellában
  // Az "Üzemeltetői adatok" sor uáni második sor cellái
  //? Subject to change: igény szerint tömbként feldolgozni, ha lehet több üzemeltető is
  operator: Operator;
  lastVisitDate: number; // "legutóbbi helyszíni ellenőrzés" sor
  expiration: number; // "tanúsítvány lejártának hatálya" sor
}

export interface Operator {
  name: string;
  address: string;
  permissionNumber: string;
  confirmDate: string;
}
