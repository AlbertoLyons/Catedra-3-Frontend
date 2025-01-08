import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoginDTO } from '../../interfaces/login-dto';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  protected invalidCredentials = false;
  protected invalidLogin = false;
  protected showSuccessModal = false;
  protected readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
      ],
    ],
  });
  
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }
    const formValue = this.loginForm.value as LoginDTO;
    const loginData: LoginDTO = {
      email: formValue.email.trim().toLowerCase(),
      password: formValue.password,
    };
    this.invalidLogin = false;
    this.authService.login(loginData).subscribe({
      next: (response) => {
        if (response) {
          if (response.token) {
            this.localStorageService.setVariable('token', response.token);
            this.localStorageService.setVariable('user', JSON.stringify(response));
            this.showSuccessModal = true;
            setTimeout(() => {
              this.router.navigate(['posts']);
            }, 2000);
          }
        } else {
          this.invalidLogin = true;
          console.log('Error on login', response);
        }
      },
      error: (error) => {
        let e = this.authService.errors;
        console.log('Error', e);
        this.invalidLogin = true;
        if (e.pop()!.includes('401')) {
          this.invalidLogin = true;
          this.loginForm.get('password')?.reset();
        }
      },
    });
  }
  protected getFieldError(fieldName: keyof LoginDTO): string {
    const control = this.loginForm.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      email: 'Correo electrónico inválido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
    };
    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }
}
