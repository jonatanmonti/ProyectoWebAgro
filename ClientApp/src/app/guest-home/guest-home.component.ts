import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as crypto from 'crypto-js';

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
  verificationMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/home']);
    }

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
    const allowedProviders = ["hotmail", "gmail", "yahoo", "outlook"];
    const emailRegex = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;

    if (!emailRegex.test(email)) return false;

    const domain = email.split("@")[1].split(".")[0];
    return allowedProviders.includes(domain);
  }

  validateRegister(): boolean {
    this.errors = {};

    if (!this.registerData.firstName.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(this.registerData.firstName)) {
      this.errors.firstName = "The first name is not valid.";
    }
    if (!this.registerData.lastName.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(this.registerData.lastName)) {
      this.errors.lastName = "The last name is not valid.";
    }
    if (!this.registerData.email.trim() || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.registerData.email)) {
      this.errors.email = "The email address is not valid.";
    } else if (!this.validateEmail(this.registerData.email)) {
      this.errors.email = "Only Hotmail, Gmail, Yahoo, or Outlook email addresses are allowed.";
    }
    if (!this.registerData.passwordHash.trim() || this.registerData.passwordHash.length < 8) {
      this.errors.passwordHash = "The password must be at least 8 characters long.";
    }
    if (!this.registerData.phone.trim() || !/^\+?[0-9]{7,15}$/.test(this.registerData.phone)) {
      this.errors.phone = "The phone number is not valid.";
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

    this.authService.register(registerPayload).subscribe(
      response => alert("Registration successful! Please check your email to verify your account."),
      error => alert(error.error.message)
    );
  }

  validateLogin(): boolean {
    this.errors = {};

    if (!this.loginData.email.trim() || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.loginData.email)) {
      this.errors.email = "The email address is not valid.";
    } else if (!this.validateEmail(this.loginData.email)) {
      this.errors.email = "Only Hotmail, Gmail, Yahoo, or Outlook email addresses are allowed.";
    }
    if (!this.loginData.passwordHash.trim() || this.loginData.passwordHash.length < 8) {
      this.errors.passwordHash = "The password must be at least 8 characters long.";
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

    this.authService.login(loginPayload).subscribe(
      response => {
        alert(response.message);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userEmail', response.email);
        this.router.navigate(['/home']);
      },
      error => alert(error.error.message)
    );
  }

  verifyEmail(token: string) {
    this.authService.verifyEmail(token).subscribe(
      response => {
        this.verificationMessage = "Your account has been verified successfully! You can now log in.";
      },
      error => {
        this.verificationMessage = "Verification failed. The token may have expired.";
      }
    );
  }
}
