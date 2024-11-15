import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DepartmentDTO } from '../../../models/auth.model';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-admin-department-form',
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule]
})
export class DepartmentFormComponent {
  @Input() visible: boolean = false;
  @Input() dialogHeader: string = '';
  @Input() submitted: boolean = false;
  @Output() hideDialog = new EventEmitter<void>();
  @Output() saveDepartment = new EventEmitter<DepartmentDTO>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  @Input() set department(value: DepartmentDTO) {
    this.form.patchValue(value);
  }

  handleSave() {
    if (this.form.valid) {
      this.saveDepartment.emit(this.form.value);
    }
  }

  handleHide() {
    this.hideDialog.emit();
  }
}
