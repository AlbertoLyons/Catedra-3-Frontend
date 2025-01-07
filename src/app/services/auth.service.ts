import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Auth } from '../interfaces/auth';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginDTO } from '../interfaces/login-dto'; 
import { RegisterDTO } from '../interfaces/register-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  public errors: string[] = [];

  login(loginData: LoginDTO): Observable<Auth> {
    return this.http.post<Auth>(`${this.baseUrl}/auth/login`, loginData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Error on login',error);
        this.errors.push(error.message || 'Unknown error');
        return throwError(() => new Error('Error on login'));
    })
    );
  }
  register(registerData: RegisterDTO): Observable<Auth> {
    return this.http.post<Auth>(`${this.baseUrl}/auth/register`, registerData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Error on register',error);
        this.errors.push(error.message || 'Unknown error');
        return throwError(() => new Error('Error on register'));
    })
    );
  }
}
