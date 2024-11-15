import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { UserEntityDTO } from '../../../models/auth.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.scss',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, CardModule, ToastModule, ReactiveFormsModule],
  providers: [MessageService]
})
export class DoctorProfileComponent {
  profileForm: FormGroup = this.fb.group({});
  user: UserEntityDTO | null = null;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.profileForm = this.fb.group({
      id: [this.user?.id || ''],
      firstName: [{ value: this.user?.firstName || '', disabled: !this.isEditing }, Validators.required],
      lastName: [{ value: this.user?.lastName || '', disabled: !this.isEditing }, Validators.required],
      email: [{ value: this.user?.email || '', disabled: !this.isEditing }, [Validators.required, Validators.email]],
      phoneNumber: [{ value: this.user?.phoneNumber || '', disabled: !this.isEditing }, Validators.required],
      address: [{ value: this.user?.address || '', disabled: !this.isEditing }, Validators.required],
      dateOfBirth: [{ value: this.user?.dateOfBirth || '', disabled: !this.isEditing }, Validators.required],
      codeCNOM: [{ value: this.user?.codeCNOM || '', disabled: !this.isEditing }, Validators.required],
      codeCNAM: [{ value: this.user?.codeCNAM || '', disabled: !this.isEditing }, Validators.required]
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const updatedUser = this.profileForm.value;
      console.log(updatedUser)
      this.authService.update(updatedUser).subscribe({
        next: response => {
          this.user = response.data;
          this.messageService.add({ severity: 'success', summary: 'Profile Updated', detail: 'Your profile has been updated successfully.' });
          this.toggleEdit();
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: 'An error occurred while updating your profile.' });
        }
      });
    }
  }
}
