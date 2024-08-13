import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { Expert } from '../interfaces/expert.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ExpertService {
  experts: Expert[] = [];

  getAllExperts(): Observable<Expert[]> {
    return of(this.experts);
  }
}
