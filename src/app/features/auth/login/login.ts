import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';
  errorMsg = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMsg = 'Inserisci email e password.';
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = '';

    this.authService
      .login(this.email, this.password)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          // Prova il ruolo dentro `user`, poi quello diretto nella response, poi quello salvato nel browser; se manca tutto usa stringa vuota.
          const role = String(response.user?.role ?? response.role ?? localStorage.getItem('role') ?? '').toLowerCase();

          if (role === 'admin') {
            void this.router.navigate(['/admin']);
            return;
          }

          void this.router.navigate(['/films']);
        },
        error: () => {
          this.errorMsg = 'Email o password non validi';
        },
      });
  }
}
