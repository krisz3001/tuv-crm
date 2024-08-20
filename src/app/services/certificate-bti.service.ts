import { inject, Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { from, Observable } from 'rxjs';
import { CertificateBTI } from '../interfaces/certificate-bti.interface';
import { addDoc, collection, Firestore, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class CertificateBTIService {
  errorHandler = inject(ErrorHandlerService);
  firestore = inject(Firestore);
  functions = inject(Functions);

  certificates = collection(this.firestore, 'certificates-bti');

  getCertificatesRealtime(handler: CallableFunction): Unsubscribe {
    return onSnapshot(this.certificates, (snapshot) => handler(snapshot.docs));
  }

  parseCertificate(file: File): Observable<CertificateBTI> {
    const result = this.fileToBase64(file).then(async (base64) => {
      const callable = httpsCallable(this.functions, 'handleParseCertificate');
      const result = await callable({ blob: base64, name: file.name, type: file.type });
      return result.data as CertificateBTI;
    });

    return from(result);
  }

  postCertificate(certificate: any): Observable<any> {
    const promise = addDoc(this.certificates, certificate);
    return from(promise);
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
