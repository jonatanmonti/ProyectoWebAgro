import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as crypto from 'crypto-js';

import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service'; // ⬅️ nuevo

@Component({
  selector: 'app-guest-home',
  templateUrl: './guest-home.component.html',
  styleUrls: ['./guest-home.component.scss']
})
export class GuestHomeComponent implements OnInit {
  activeTab: string = 'register';

  registerData = { firstName: '', lastName: '', email: '', phone: '', passwordHash: '' };
  loginData = { email: '', passwordHash: '' };

  errors: any = {};
  // verificationMessage ya no es necesario si mostramos modal, pero lo dejo por si querés seguir mostrando el banner
  verificationMessage: string = '';

  constructor(
    private authService: AuthService,
    private modal: ModalService,        // ⬅️ inyectamos modal
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/home']);
      return;
    }

    // Captura de token de verificación por querystring
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.verifyEmail(params['token']);
      }
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.errors = {};
  }

  validateEmail(email: string): boolean {
    const allowedProviders = ['hotmail', 'gmail', 'yahoo', 'outlook'];
    const emailRegex = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;

    if (!emailRegex.test(email)) return false;

    const domain = email.split('@')[1].split('.')[0];
    return allowedProviders.includes(domain);
  }

  validateRegister(): boolean {
    this.errors = {};

    if (!this.registerData.firstName.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(this.registerData.firstName)) {
      this.errors.firstName = 'The first name is not valid.';
    }
    if (!this.registerData.lastName.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(this.registerData.lastName)) {
      this.errors.lastName = 'The last name is not valid.';
    }
    if (!this.registerData.email.trim() || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.registerData.email)) {
      this.errors.email = 'The email address is not valid.';
    } else if (!this.validateEmail(this.registerData.email)) {
      this.errors.email = 'Only Hotmail, Gmail, Yahoo, or Outlook email addresses are allowed.';
    }
    if (!this.registerData.passwordHash.trim() || this.registerData.passwordHash.length < 8) {
      this.errors.passwordHash = 'The password must be at least 8 characters long.';
    }
    if (!this.registerData.phone.trim() || !/^\+?[0-9]{7,15}$/.test(this.registerData.phone)) {
      this.errors.phone = 'The phone number is not valid.';
    }
    return Object.keys(this.errors).length === 0;
  }

  registerUser() {
    if (!this.validateRegister()) return;

    const hashedPassword = crypto.SHA256(this.registerData.passwordHash).toString();

    const registerPayload = {
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      email: this.registerData.email,
      phone: this.registerData.phone,
      passwordHash: hashedPassword
    };

    this.authService.register(registerPayload).subscribe({
      next: (resp: any) => {
        // Modal de éxito con mensaje que viene del backend
        this.modal.open({
          title: 'Registration successful',
          message: resp?.message || 'Account created. Please verify your email.',
          type: 'success',
          confirmText: 'Got it'
        });
        // Opcional: pasar a Login
        this.activeTab = 'login';
      },
      error: (err) => {
        const msg = err?.error?.message || 'Registration failed. Please try again.';
        this.modal.open({ title: 'Error', message: msg, type: 'error' });
      }
    });
  }

  validateLogin(): boolean {
    this.errors = {};

    if (!this.loginData.email.trim() || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.loginData.email)) {
      this.errors.email = 'The email address is not valid.';
    } else if (!this.validateEmail(this.loginData.email)) {
      this.errors.email = 'Only Hotmail, Gmail, Yahoo, or Outlook email addresses are allowed.';
    }
    if (!this.loginData.passwordHash.trim() || this.loginData.passwordHash.length < 8) {
      this.errors.passwordHash = 'The password must be at least 8 characters long.';
    }
    return Object.keys(this.errors).length === 0;
  }

  loginUser() {
    if (!this.validateLogin()) return;

    const hashedPassword = crypto.SHA256(this.loginData.passwordHash).toString();

    const loginPayload = {
      email: this.loginData.email,
      passwordHash: hashedPassword
    };

    this.authService.login(loginPayload).subscribe({
      next: (resp: any) => {
        this.modal.open({
          title: 'Welcome!',
          message: resp?.message || 'Login successful.',
          type: 'success'
        });
        localStorage.setItem('userId', resp.userId);
        localStorage.setItem('userEmail', resp.email);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Invalid credentials.';
        this.modal.open({ title: 'Login error', message: msg, type: 'warning' });
      }
    });
  }

  verifyEmail(token: string) {
    this.authService.verifyEmail(token).subscribe({
      next: () => {
        // Si ya no querés el banner, podés eliminar verificationMessage y solo usar el modal
        this.verificationMessage = 'Your account has been verified successfully! You can now log in.';
        this.modal.open({
          title: 'Email verified',
          message: 'Your account has been verified successfully! You can now log in.',
          type: 'success',
          confirmText: 'Go to login'
        });
        this.activeTab = 'login';
      },
      error: () => {
        this.verificationMessage = 'Verification failed. The token may have expired.';
        this.modal.open({
          title: 'Verification failed',
          message: 'Verification failed. The token may have expired.',
          type: 'error'
        });
      }
    });
  }
}
