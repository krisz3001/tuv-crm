import { Injectable } from '@angular/core';
import { MESSAGES } from '../messages/messages';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleError(error: any): void {
    let errorMessage = error.code;

    switch (error.code) {
      case 'auth/invalid-email':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-credentials':
        errorMessage = MESSAGES.ErrInvalidCredentials;
        break;
      case 'auth/email-already-in-use':
        errorMessage = MESSAGES.ErrAlreadyRegistered;
        break;
      default:
        errorMessage = `${MESSAGES.ErrUnexpected}: ${error.code}`;
    }

    throw new Error(errorMessage);
  }
}
