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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;

    if (!emailRegex.test(email)) return false;

    const domain = email.split("@")[1].split(".")[0];
    return allowedProviders.includes(domain);
  }

  validateRegister(): boolean {
    this.errors = {};

    if (!this.registerData.firstName.trim()) {
      this.errors.firstName = "First name is required.";
    }
    if (!this.registerData.lastName.trim()) {
      this.errors.lastName = "Last name is required.";
    }
    if (!this.registerData.email.trim()) {
      this.errors.email = "Email is required.";
    } else if (!this.validateEmail(this.registerData.email)) {
      this.errors.email = "Only Hotmail, Gmail, Yahoo, or Outlook emails are allowed.";
    }
    if (!this.registerData.passwordHash.trim()) {
      this.errors.passwordHash = "Password is required.";
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

    if (!this.loginData.email.trim()) {
      this.errors.email = "Email is required.";
    } else if (!this.validateEmail(this.loginData.email)) {
      this.errors.email = "Only Hotmail, Gmail, Yahoo, or Outlook emails are allowed.";
    }
    if (!this.loginData.passwordHash.trim()) {
      this.errors.passwordHash = "Password is required.";
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
