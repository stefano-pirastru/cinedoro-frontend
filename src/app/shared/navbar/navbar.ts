import { Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  // Computed signals
  isAdmin = computed(() => this.authService.getUserRole() === 'admin');
  userName = computed(() => this.authService.getUserName());

  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}