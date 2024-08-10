import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry } from 'rxjs';
import { Client } from '../interfaces/client.interface';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  clients: Client[] = [];

  getClients(): Observable<Client[]> {
    return this.http
      .get<Client[]>(`${environment.apiUrl}/clients`, {
        withCredentials: true,
      })
      .pipe(
        catchError(this.errorHandler.handleError),
        map((res) => {
          this.clients = res;
          return this.clients;
        })
      );
  }

  getClient(id: number): Observable<Client> {
    return this.http
      .get<Client>(`${environment.apiUrl}/clients/${id}`, {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.handleError));
  }

  postClient(client: Client): Observable<Client> {
    return this.http
      .post<Client>(`${environment.apiUrl}/clients`, client, {
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError(this.errorHandler.handleError),
        map((res) => {
          this.clients = [...this.clients, res];
          return res;
        })
      );
  }

  patchClient(client: Client): Observable<Client> {
    return this.http
      .patch<Client>(`${environment.apiUrl}/clients/${client.id}`, client, {
        withCredentials: true,
      })
      .pipe(
        retry(3),
        catchError(this.errorHandler.handleError),
        map((res) => {
          this.clients = this.clients.map((c) => (c.id === res.id ? res : c));
          return res;
        })
      );
  }

  deleteClient(id: number): Observable<any> {
    return this.http
      .delete(`${environment.apiUrl}/clients/${id}`, {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.handleError));
  }
}
