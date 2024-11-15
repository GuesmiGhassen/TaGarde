import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { UserEntityDTO } from '../../../models/auth.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HospitalOwnerService } from '../../../service/ADMIN/hospital-owner.service';

@Component({
  selector: 'app-hospital-owner-profile',
  templateUrl: './hospital-owner-profile.component.html',
  styleUrl: './hospital-owner-profile.component.scss',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, CardModule, ReactiveFormsModule]
})
export class HospitalOwnerProfileComponent {
  profileForm: FormGroup = this.fb.group({});
  user: UserEntityDTO | null = null;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private hospitalOwnerService: HospitalOwnerService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    console.log(this.user)
    this.profileForm = this.fb.group({
      id: [this.user?.id || ''],
      firstName: [{ value: this.user?.firstName || '', disabled: !this.isEditing }, Validators.required],
      lastName: [{ value: this.user?.lastName || '', disabled: !this.isEditing }, Validators.required],
      email: [{ value: this.user?.email || '', disabled: !this.isEditing }, [Validators.required, Validators.email]],
      phoneNumber: [{ value: this.user?.phoneNumber || '', disabled: !this.isEditing }, Validators.required],
      address: [{ value: this.user?.address || '', disabled: !this.isEditing }, Validators.required]
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
      console.log(updatedUser.id)
      this.authService.update(updatedUser).subscribe(response => {
        this.user = response.data;
        this.toggleEdit();
      });
    }
  }
}
