import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Credentials } from '../interfaces/credentials.interface';
import { Observable, catchError, from, map, of } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { User } from '../interfaces/user.interface';
import { environment } from '../environments/environment.development';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  firebaseAuth = inject(Auth);

  user = user(this.firebaseAuth);
  currentUserSignal = signal<User | null | undefined>(undefined);

  register(credentials: Credentials): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, credentials.email, credentials.password).then((res) =>
      updateProfile(res.user, { displayName: credentials.fullname })
    );
    return from(promise);
  }

  login(credentials: Credentials): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, credentials.email, credentials.password).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    return from(signOut(this.firebaseAuth));
  }
}
