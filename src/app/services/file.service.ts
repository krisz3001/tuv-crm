import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { FileType } from '../enums/file-type';
import { Document } from '../interfaces/document.interface';
import { ErrorHandlerService } from './error-handler.service';
import { Firestore } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, list, ListResult, ref, Storage, StorageReference, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  errorHandler = inject(ErrorHandlerService);
  firestore = inject(Firestore);
  storage = inject(Storage);

  fileType: FileType | null = null;

  getFiles(document: Document): Observable<ListResult | void> {
    const promise = list(ref(this.storage, `${document.clientId}/offers/${document.firebaseId}`)).catch((error) => this.errorHandler.handleError(error));
    return from(promise);
  }

  deleteFile(ref: StorageReference): Observable<any> {
    const promise = deleteObject(ref).catch((error) => this.errorHandler.handleError(error));
    return from(promise);
  }

  downloadFile(ref: StorageReference): Observable<any> {
    const promise = getDownloadURL(ref)
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          saveFile(xhr.response, ref.name);
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => this.errorHandler.handleError(error));
    return from(promise);
  }

  uploadFile(document: Document, file: globalThis.File): Observable<any> {
    const path = `${document.clientId}/offers/${document.firebaseId}/${file.name}`;
    const fileRef = ref(this.storage, path);
    const promise = uploadBytes(fileRef, file).catch((error) => this.errorHandler.handleError(error));
    return from(promise);
  }
}

function saveFile(blob: Blob, name: string): void {
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = decodeURIComponent(name);
  a.click();
  window.URL.revokeObjectURL(a.href);
}
