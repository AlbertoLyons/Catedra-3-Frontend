import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>, 
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const LLService = inject(LocalStorageService);
  const token = LLService.getVariable('token');
  let modifiedRequest = req;
  if (token) {
    modifiedRequest = req.clone({
      headers: req.headers.set('authorization', `bearer ${token}`),
    });
  }

  return next(modifiedRequest).pipe(
    tap((event) => {
      console.log('Event',event);
      if (event instanceof HttpResponse) {
        if (event.status === 401) {
          console.log('Unauthorized, expired token');
          LLService.removeValue('token');
          LLService.removeValue('user');
          router.navigate(['login']);
        }
        const newToken = event.body.token;
        console.log('New Token',newToken);
        if (newToken) {
          LLService.setVariable('token', newToken);
          if (event.body.user) {
            LLService.setVariable('user', JSON.stringify(event.body.user));
          }
        }
      }
    }
  ));
};
