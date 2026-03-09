import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  // Signals for reactive state
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));
  userName = signal<string | null>(localStorage.getItem('userName'));
  userRole = signal<string | null>(localStorage.getItem('userRole'));

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    return this.http.post<{ token: string; id: string; firstName: string; lastName: string; role: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('userName', `${response.firstName} ${response.lastName}`);
        localStorage.setItem('userRole', response.role);

        this.isLoggedIn.set(true);
        this.userName.set(`${response.firstName} ${response.lastName}`);
        this.userRole.set(response.role);

        if (response.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');

    this.isLoggedIn.set(false);
    this.userName.set(null);
    this.userRole.set(null);

    this.router.navigate(['/login']);
  }

  getUserRole(): string | null {
    return this.userRole();
  }

  getUserName(): string | null {
    return this.userName();
  }
}
