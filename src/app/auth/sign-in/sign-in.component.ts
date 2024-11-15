import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { LogInDTO, LogInResponseDTO } from '../../models/auth.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LoadingService } from '../../service/loading.service';
import { SpinnerComponent } from '../../components/common/spinner/spinner.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  providers: [MessageService],
  imports: [FormsModule, PasswordModule, ToastModule, InputTextModule, ButtonModule, SpinnerComponent, CommonModule]
})
export class SignInComponent {
  imageUrl = 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720356746/Tagad_cr4ngm.png';
  submitted = false;
  isLoading = false;
  loginData: LogInDTO = { email: '', password: '' };
  loginResponse: LogInResponseDTO | null = null;
  errorMessage: string | null = null;
  passwordVisible = false;
  value!: string;
  constructor(private authService: AuthService, private router: Router, private messageService: MessageService, private loadingService: LoadingService) { }
  ngOninit(){
    this.loadingService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
  onLogin() {
    this.submitted = true;
    this.loadingService.showLoading();
    this.authService.login(this.loginData).subscribe(
      (response: LogInResponseDTO) => {
        this.loadingService.hideLoading();
        if (response && response.accessToken) {
          this.navigateBasedOnRole(response.userEntityDTO.role.name);
        }
      },
      (error) => {
        this.loadingService.hideLoading();
        this.handleError(error);
      }
    );
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  private navigateBasedOnRole(role: string) {
    switch (role) {
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'ROLE_HOSPITAL_OWNER':
        this.router.navigate(['/hospital-owner']);
        break;
      case 'ROLE_GENERAL_MANAGER':
        this.router.navigate(['/general-manager']);
        break;
      case 'ROLE_DEPARTMENT_MANAGER':
        this.router.navigate(['/department-manager']);
        break;
      case 'ROLE_DOCTOR':
        this.router.navigate(['/doctor']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
  private handleError(error: any) {
    if (error.status === 400) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: `Invalid email or password. `
      });
    } else if (error.status === 401) {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: `${error.errors}`
      });
    } else if (error.status === 500) {
      this.messageService.add({
        severity: 'error',
        summary: 'Server Error',
        detail: 'An unexpected error occurred. Please try again later.'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred.'
      });
    }
  }
}
