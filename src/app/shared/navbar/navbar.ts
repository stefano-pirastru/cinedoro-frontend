import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  isAdmin = false;
  constructor(
    public authService: AuthService,
  ) { }
  ngOnInit() {
    const role = localStorage.getItem('role');
    this.isAdmin = role?.toLowerCase() === 'admin';
  }

  logout() {
    this.authService.logout();
  }
}
