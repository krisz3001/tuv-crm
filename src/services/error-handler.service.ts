import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { MESSAGES } from '../messages/messages';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    switch (error.status) {
      case 500:
        errorMessage = `${MESSAGES.ErrInternalServerError}: ${error.message}`;
        break;
      case 401:
        errorMessage = MESSAGES.ErrInvalidCredentials;
        break;
      case 400:
        errorMessage = `${MESSAGES.ErrBadRequest}: ${error.message}`;
        break;
      case 409:
        errorMessage = MESSAGES.ErrAlreadyRegistered;
        break;
      case 413:
        errorMessage = MESSAGES.ErrFileTooLarge;
        break;
      default:
        errorMessage = `${MESSAGES.ErrUnexpected}: ${error.message}`;
        break;
    }

    return throwError(() => new Error(errorMessage));
  }
}
