import { inject, Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { Observable, of } from 'rxjs';
import { collection, Firestore, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { CertificateHEG } from '../interfaces/certificate-heg.interface';

@Injectable({
  providedIn: 'root',
})
export class CertificateHEGService {
  errorHandler = inject(ErrorHandlerService);
  firestore = inject(Firestore);

  certificates = collection(this.firestore, 'certificates-heg');

  getCertificatesRealtime(handler: CallableFunction): Unsubscribe {
    return onSnapshot(this.certificates, (snapshot) => handler(snapshot.docs));
  }

  postCertificate(certificate: CertificateHEG): Observable<any> {
    return of(null);
  }
}
