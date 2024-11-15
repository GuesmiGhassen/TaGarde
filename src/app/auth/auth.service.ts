import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LogInDTO, RegisterDTO, UserEntityDTO, LogInResponseDTO, ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUser: UserEntityDTO | null = null;
  private modUrl = '';

  constructor(private http: HttpClient, private router: Router) { }
  private userRoleSubject = new BehaviorSubject<string>('');
  userRole$ = this.userRoleSubject.asObservable();

  register(role: string, registerData: RegisterDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register?role=${role}`, registerData).pipe(
      map(response => response),
      catchError(this.handleError<any>('register'))
    );
  }

  login(credentials: LogInDTO): Observable<LogInResponseDTO> {
    return this.http.post<ApiResponse<LogInResponseDTO>>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        if (response.data) {
          sessionStorage.setItem('access_token', response.data.accessToken);
          sessionStorage.setItem('refresh_token', response.data.refreshToken);
          sessionStorage.setItem('user_entity', JSON.stringify(response.data.userEntityDTO));
          this.currentUser = response.data.userEntityDTO;
          this.userRoleSubject.next(response.data.userEntityDTO.role.name);
        }
        const userEntityDTOString = sessionStorage.getItem('user_entity');
        const userEntityDTO = userEntityDTOString ? JSON.parse(userEntityDTOString) : null;
        console.log(userEntityDTO);
        return response.data;
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  validateToken(token: string): Observable<boolean> {
    return this.http.get<{ message: string, data: string, status: number, timestamp: string }>(`${this.apiUrl}/validate/${token}`).pipe(
      map(response => response.status === 200),
      catchError(this.handleError<boolean>('validateToken', false))
    );
  }
  logout(): void {
    sessionStorage.clear();
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
  update(item: UserEntityDTO): Observable<ApiResponse<UserEntityDTO>> {
    // const headers = this.createAuthorizationHeaders();
    const role = this.getCurrentUserRole();
    if (role) {
      this.modUrl = this.getModUrl(role);
    }
    return this.http.put<ApiResponse<UserEntityDTO>>(`http://localhost:8081/api/v1/${this.modUrl}/${item.id}`, item).pipe(
      map(response => {
        if (response.data) {
          sessionStorage.setItem('user_entity', JSON.stringify(response.data));
          this.currentUser = response.data;
          this.userRoleSubject.next(response.data.role.name);
        }
        const userEntityDTOString = sessionStorage.getItem('user_entity');
        const userEntityDTO = userEntityDTOString ? JSON.parse(userEntityDTOString) : null;
        console.log(userEntityDTO);
        window.location.reload();
        return response.data;
      }),
      catchError(this.handleError<any>('update'))
    );
  }
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('access_token');
    }
    return false;
  }
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role.name : null;
  }
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('access_token');
    }
    return null;
  }

  getCurrentUser(): UserEntityDTO | null {
    if (!this.currentUser && this.isAuthenticated()) {
      this.loadCurrentUser();
    }
    return this.currentUser;
  }

  private loadCurrentUser(): void {
    const userEntityDTOString = sessionStorage.getItem('user_entity');
    if (userEntityDTOString) {
      try {
        this.currentUser = JSON.parse(userEntityDTOString);
      } catch (error) {
        console.error('Error parsing user entity from session storage', error);
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }

  private createAuthorizationHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = sessionStorage.getItem('access_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: HttpErrorResponse): Observable<T> => {
  //     // console.error(`${operation} failed: ${error.status} - ${error.message}`);
  //     return throwError(() => new Error(`${operation} failed: ${error.message}`)); // Ensure error is thrown to be handled in the component
  //   };
  // }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.status} - ${error.message}`);
      console.error('Error details:', error);
      const statusCode = error.error;
      console.log(statusCode)
      const errorMessage = error.error?.message || error.message || 'An unexpected error occurred.';
      return throwError((statusCode));
    };
  }
  private getModUrl(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'admin';
      case 'ROLE_GENERAL_MANAGER':
        return 'general-manager';
      case 'ROLE_HOSPITAL_OWNER':
        return 'hospital-owner';
      case 'ROLE_DOCTOR':
        return 'doctor';
      case 'ROLE_DEPARTMENT_MANAGER':
        return 'doctor';
      default:
        console.warn(`Unknown role: ${role}`);
        return 'default';
    }
  }

}
