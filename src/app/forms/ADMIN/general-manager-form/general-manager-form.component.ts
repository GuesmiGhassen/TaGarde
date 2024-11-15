import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralManagerDTO } from '../../../models/auth.model';
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
  selector: 'app-admin-general-manager-form',
  templateUrl: './general-manager-form.component.html',
  styleUrl: './general-manager-form.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, FormsModule, InputNumberModule]
})
export class GeneralManagerFormComponent {
  @Input() visible: boolean = false;
  @Input() dialogHeader: string = '';
  @Input() submitted: boolean = false;
  @Output() hideDialog = new EventEmitter<void>();
  @Output() saveGeneralManager = new EventEmitter<GeneralManagerDTO>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['',Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  @Input() set generalManager(value: GeneralManagerDTO) {
    this.form.patchValue(value);
  }

  handleSave() {
    if (this.form.valid) {
      this.saveGeneralManager.emit(this.form.value);
    }
  }

  handleHide() {
    this.hideDialog.emit();
  }
}
