import { inject, Injectable, signal } from '@angular/core';
import { Credentials } from '../interfaces/credentials.interface';
import { Observable, from } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { User } from '../interfaces/user.interface';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { ExpertService } from './expert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  errorHandler = inject(ErrorHandlerService);
  expertService = inject(ExpertService);

  user = user(this.firebaseAuth);
  currentUserSignal = signal<User | null | undefined>(undefined);

  register(credentials: Credentials): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, credentials.email, credentials.password)
      .then(async (res) => {
        await updateProfile(res.user, { displayName: credentials.fullname });
        return res.user;
      })
      .then((user) => this.expertService.updateExpertName(user.uid, credentials.fullname))
      .catch((error) => this.errorHandler.handleError(error));
    return from(promise);
  }

  login(credentials: Credentials): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, credentials.email, credentials.password)
      .then(() => {})
      .catch((error) => this.errorHandler.handleError(error));
    return from(promise);
  }

  logout(): Observable<void> {
    return from(signOut(this.firebaseAuth));
  }
}
