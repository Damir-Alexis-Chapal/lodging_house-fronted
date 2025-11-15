import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    birthDate: '',
    phoneNumber: ''
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

  this.authService.register(this.userData).subscribe({
    next: (newUser: any) => {
      console.log('✅ Registro exitoso - Usuario creado:', newUser);
      
      // LIMPIAR sesión anterior antes del nuevo login
      this.authService.logout();
      
      // Hacer login automático con las mismas credenciales
      const loginCredentials = {
        email: this.userData.email,
        password: this.userData.password
      };
      
      this.authService.login(loginCredentials).subscribe({
        next: (token: string) => {
          this.isLoading = false;
          console.log('✅ Login automático exitoso - Token:', token);
          
          // Obtener datos completos del usuario
          this.authService.getCurrentUser().subscribe({
            next: (user: any) => {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.router.navigate(['/profile']);
            },
            error: (error: any) => {
              this.isLoading = false;
              console.error('❌ Error obteniendo usuario después del registro:', error);
              // Si falla obtener el usuario, usar los datos del registro
              localStorage.setItem('currentUser', JSON.stringify(newUser));
              this.router.navigate(['/profile']);
            }
          });
        },
        error: (loginError: any) => {
          this.isLoading = false;
          console.error('❌ Error en login automático:', loginError);
          this.errorMessage = 'Registro exitoso, pero error en login automático';
        }
      });
    },
    error: (error: any) => {
      this.isLoading = false;
      console.error('❌ Error en registro:', error);
      this.errorMessage = error.error?.message || 'Error en el registro. Intenta nuevamente.';
    }
  });
}
}