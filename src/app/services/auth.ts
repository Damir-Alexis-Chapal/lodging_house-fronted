import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  phoneNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<string> {
    const url = `${this.baseUrl}/api/v1/auth/login`;
    console.log('URL de login:', url);
    console.log('Credenciales:', credentials);
    
    return this.http.post(url, credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text'
    }).pipe(
      tap((response: string) => {
        console.log('Respuesta CRUDA:', response);
        console.log('Tipo de respuesta:', typeof response);
        console.log('Longitud de respuesta:', response.length);
        
        // Verificar si es HTML
        if (response.includes('<!DOCTYPE html>') || response.includes('<html')) {
          console.error('ERROR: Se recibió HTML en lugar del token');
          console.error('Primeros 200 caracteres:', response.substring(0, 200));
        } else {
          console.log('Token recibido correctamente');
          localStorage.setItem('authToken', response);
        }
      })
    );
  }

  getCurrentUser(): Observable<User> {
    const token = this.getToken();
    console.log('Token usado para /me:', token);
    return this.http.get<User>(`${this.baseUrl}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  register(userData: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/v1/users`, userData, {
      headers:{
        'Content-Type': 'application/json'
      }
    }
    );
  }

  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/v1/users/${userId}`);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  getCurrentUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
