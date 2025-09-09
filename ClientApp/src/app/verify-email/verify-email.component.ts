import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  state: 'loading' | 'success' | 'error' = 'loading';
  message = 'Verifying your account...';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.state = 'error';
      this.message = 'Verification token is missing.';
      return;
    }

    this.http.get<{ message: string }>(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .subscribe({
        next: (res) => {
          this.state = 'success';
          this.message = res?.message ?? 'Your account has been verified.';
        },
        error: (err) => {
          this.state = 'error';
          this.message = err?.error?.message || 'Invalid or expired token.';
        }
      });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
