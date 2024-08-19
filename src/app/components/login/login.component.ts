import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CONFIG } from '../../config';
import { Credentials } from '../../interfaces/credentials.interface';
import { MESSAGES } from '../../messages/messages';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: '../../styles/auth.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  messages = MESSAGES;
  passwordMinLength = CONFIG.PasswordMinLength;
  loginError: string = '';

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]), //TODO: readd Validators.email, disabled while developing
    password: new FormControl('', [Validators.required, Validators.maxLength(CONFIG.PasswordMaxLength)]),
  });

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials: Credentials = {
      email: this.loginForm.get('email')?.value!,
      password: this.loginForm.get('password')?.value!,
      fullname: '',
    };

    this.authService.login(credentials).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => (this.loginError = err.message),
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  resetError(): void {
    this.loginError = '';
  }
}
