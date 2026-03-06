import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  // stato reattivo login
  isLoggedIn = signal(!!localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          // `?.` evita errori se `user` non esiste; `??` usa `response.role` solo se il valore a sinistra manca.
          const role = response.user?.role ?? response.role;
          if (role) {
            localStorage.setItem('role', String(role).toLowerCase());
          }
          this.isLoggedIn.set(true);   // aggiorna stato
        })
      );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedIn.set(false);  // aggiorna stato
    this.router.navigate(['/login']);
  }
}
