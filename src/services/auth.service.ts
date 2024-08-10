import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials } from '../interfaces/credentials.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { User } from '../interfaces/user.interface';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  user: User | null = null;
  token: string | null = null;

  register(credentials: Credentials): Observable<boolean> {
    return this.http
      .post<any>(`${environment.baseUrl}/register`, credentials, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        catchError(this.errorHandler.handleError),
        map((res) => {
          if (res.headers.has('CSRF')) {
            this.token = res.headers.get('CSRF') || '';
            this.user = res.body;
            return true;
          }
          return false;
        })
      );
  }

  login(credentials: Credentials): Observable<boolean> {
    return this.http
      .post<any>(`${environment.baseUrl}/login`, credentials, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        catchError(this.errorHandler.handleError),
        map((res) => {
          if (res.headers.has('CSRF')) {
            this.token = res.headers.get('CSRF') || '';
            this.user = res.body;
            return true;
          }
          return false;
        })
      );
  }

  logout(): Observable<boolean> {
    return this.http
      .get(`${environment.baseUrl}/logout`, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        catchError(this.errorHandler.handleError),
        map((res) => {
          if (!res) return false;
          if (res.status === 200) {
            this.token = null;
            this.user = null;
            return true;
          }
          return false;
        })
      );
  }

  getCsrfToken(): Observable<string> {
    if (typeof this.token === 'string') return of(this.token);
    return this.http
      .get<User>(`${environment.baseUrl}/auth`, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        catchError(() => of('')),
        map((res) => {
          if (typeof res === 'string') return '';
          if (!res.headers.has('Csrf')) return '';
          this.token = res.headers.get('Csrf')!;
          this.user = res.body;
          return this.token;
        })
      );
  }
}
