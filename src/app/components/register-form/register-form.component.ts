import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { RegisterDTO } from '../../interfaces/register-dto';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  protected invalidRegister = false;
  protected showSuccessModal = false;
  protected readonly registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        this.validateDigit.bind(this),
      ],
    ],
  });
  validateDigit(control: FormControl) {
    const hasDigit = /[0-9]/.test(control.value);
    return hasDigit ? null : { digit: true };
  }
  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      return;
    }
    const formValue = this.registerForm.value as RegisterDTO;
    const registerData: RegisterDTO = {
      email: formValue.email.trim().toLowerCase(),
      password: formValue.password,
    };
    this.invalidRegister = false;
    this.authService.register(registerData).subscribe({
      next: (response) => {
        if (response) {
          if (response.token) {
            this.localStorageService.setVariable('token', response.token);
            this.localStorageService.setVariable('user', JSON.stringify(response));
            this.showSuccessModal = true;
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 2000);
          }
        } else {
          this.invalidRegister = true;
          console.log('Error on register', response);
        }
      },
      error: (error) => {
        let e = this.authService.errors;
        console.log('Error', e);
        const errorString = e.pop();
        if (errorString!.includes('400') ) {
          this.invalidRegister = true;
          this.registerForm.get('password')?.reset();
        }
      },
    });
  }
  protected getFieldError(fieldName: keyof RegisterDTO): string {
    const control = this.registerForm.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      email: 'Correo electrónico inválido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      digit: 'Debe contener al menos un número',
    };
    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }
}
