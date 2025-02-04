import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import * as crypto from 'crypto-js'; // Importamos la librería para hash

@Component({
  selector: 'app-guest-home',
  templateUrl: './guest-home.component.html',
  styleUrls: ['./guest-home.component.scss']
})
export class GuestHomeComponent {

  activeTab: string = 'register';

  registerData = { firstName: '', lastName: '', email: '', phone: '', passwordHash: '' };
  loginData = { email: '', passwordHash: '' };

  constructor(private authService: AuthService, private router: Router) { }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  registerUser() {
    const hashedPassword = crypto.SHA256(this.registerData.passwordHash).toString();

    const registerPayload = {
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      email: this.registerData.email,
      phone: this.registerData.phone,
      passwordHash: hashedPassword
    };

    this.authService.register(registerPayload).subscribe(
      response => alert(response.message),
      error => alert(error.error.message)
    );
  }

  loginUser() {
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
}
