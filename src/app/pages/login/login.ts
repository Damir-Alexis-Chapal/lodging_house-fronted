import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (token: string) => {
        console.log('Login exitoso - Token:', token);
        
        // Ahora obtenemos los datos del usuario con el token
        this.authService.getCurrentUser().subscribe({
          next: (user: any) => {
            this.isLoading = false;
            console.log('Usuario obtenido:', user);
            
            // Guardar usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirigir al perfil
            this.router.navigate(['/profile']);
          },
          error: (userError: any) => {
            this.isLoading = false;
            console.error('Error obteniendo usuario:', userError);
            this.errorMessage = 'Login exitoso, pero error cargando perfil';
          }
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error en login:', error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}