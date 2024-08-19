import { inject, Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { collection, doc, Firestore, onSnapshot, Unsubscribe, updateDoc } from '@angular/fire/firestore';
import { catchError, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpertService {
  errorHandler = inject(ErrorHandlerService);
  firestore = inject(Firestore);

  experts = collection(this.firestore, 'experts');

  getExpertsRealtime(handler: CallableFunction): Unsubscribe {
    return onSnapshot(this.experts, (snapshot) => handler(snapshot.docs));
  }

  updateExpertName(id: string, name: string): Promise<void> {
    const expert = doc(this.experts, id);
    return updateDoc(expert, { name }).catch(this.errorHandler.handleError);
  }
}
