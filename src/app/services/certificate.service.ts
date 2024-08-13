import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Certificate } from '../interfaces/certificate.interface';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  constructor(
    private errorHandler: ErrorHandlerService,
    private http: HttpClient,
  ) {}

  certificates: BehaviorSubject<Certificate[]> = new BehaviorSubject<Certificate[]>([]);

  getAll(): Observable<any> {
    return this.http
      .get<Certificate[]>(`${environment.apiUrl}/certificates`, {
        withCredentials: true,
      })
      .pipe(
        catchError(this.errorHandler.handleError),
        map((res) => {
          this.certificates.next(res);
          return res;
        }),
      );
  }

  postCertificate(certificate: Certificate): Observable<any> {
    return this.http
      .post<Certificate>(`${environment.apiUrl}/certificates`, certificate, {
        withCredentials: true,
      })
      .pipe(
        catchError(this.errorHandler.handleError),
        map((res) => {
          const ordered = [...this.certificates.value, res].sort((a, b) => (new Date(a.expiration) as any) - (new Date(b.expiration) as any));
          this.certificates.next(ordered);
          return res;
        }),
      );
  }
}
