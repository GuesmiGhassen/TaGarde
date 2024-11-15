import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralManagerDTO, HospitalDTO, HospitalOwnerDTO } from '../../../models/auth.model';
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
  selector: 'app-admin-hospital-form',
  templateUrl: './hospital-form.component.html',
  styleUrl: './hospital-form.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, FormsModule, InputNumberModule]
})
export class HospitalFormComponent {
  @Input() visible: boolean = false;
  @Input() dialogHeader: string = '';
  @Input() submitted: boolean = false;
  @Input() hospitalOwnerOptions: HospitalOwnerDTO[] = [];
  @Input() generalManagerOptions: GeneralManagerDTO[] = [];
  @Output() hideDialog = new EventEmitter<void>();
  @Output() saveHospital = new EventEmitter<HospitalDTO>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      hospitalOwnerId: [''],
      generalManagerId: ['']
    });
  }
  
  @Input() set hospital(value: HospitalDTO) {
    this.form.patchValue(value);
  }

  handleSave() {
    if (this.form.valid) {
      console.log(this.form)
      this.saveHospital.emit(this.form.value);
    }
  }

  handleHide() {
    this.hideDialog.emit();
  }

}
