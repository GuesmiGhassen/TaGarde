import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DoctorDTO, specialityDTO } from '../../../models/auth.model';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-admin-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, FormsModule, InputNumberModule]
})
export class DoctorFormComponent {
  @Input() visible: boolean = false;
  @Input() dialogHeader: string = '';
  @Input() submitted: boolean = false;
  @Input() Specialities: specialityDTO[] = [];
  @Output() hideDialog = new EventEmitter<void>();
  @Output() saveDoctor = new EventEmitter<DoctorDTO>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      codeCNOM: ['', Validators.required],
      codeCNAM: ['', Validators.required],
      specialityId: ['', Validators.required]
    });
  }

  onSpecialityChange(event: any) {
    const selectedId = event.value; 
    const selectedSpeciality = this.Specialities.find(s => s.id === selectedId); 
    this.form.get('specialityId')?.setValue(selectedSpeciality?.id);  
  }
  @Input() set doctor(value: DoctorDTO) {

    this.form.patchValue({
      ...value,
      specialityId: value.specialityDTO?.id
    });
  }

  handleSave() {
    if (this.form.valid) {
      this.saveDoctor.emit(this.form.value);
    }
  }

  handleHide() {
    this.hideDialog.emit();
  }
}
