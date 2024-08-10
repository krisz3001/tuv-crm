import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggerInterceptor } from './logger.interceptor';
import { CsrfInterceptor } from './csrf.interceptor';

export interface HttpInterceptorProvider {
  provide: any;
  useClass: any;
  multi: boolean;
}

export const httpInterceptorProviders: HttpInterceptorProvider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: LoggerInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
];
