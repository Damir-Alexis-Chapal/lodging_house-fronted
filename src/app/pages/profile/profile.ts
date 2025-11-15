import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.isLoading = false;
        this.user = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Usuario cargado desde servidor:', this.user);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error cargando perfil:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Token inválido o expirado';
        } else if (error.status === 403) {
          this.errorMessage = 'Acceso denegado';
        } else {
          this.errorMessage = 'Error al cargar el perfil del usuario';
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}