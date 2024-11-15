import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { DepartmentDTO } from '../../../models/auth.model';
import { DataEvent } from '../../../blocs/ADMIN/manage-departments/manage-departments.event';
import { AuthService } from '../../../auth/auth.service';
import { ManageDepartmentBloc } from '../../../blocs/ADMIN/manage-departments/manage-departments.bloc';
import { DepartmentFormComponent } from "../../../forms/ADMIN/department-form/department-form.component";

@Component({
  selector: 'app-manage-departments',
  templateUrl: './manage-departments.component.html',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, InputNumberModule, DepartmentFormComponent],
  providers: [MessageService, ConfirmationService],
  styleUrl: './manage-departments.component.scss'
})

export class ManageDepartmentsComponent {
  DepartmentDialog = false;
  dialogHeader = '';
  submitted = false;
  currentUserRole: string | null = null;
  selectedDepartments: DepartmentDTO[] = [];
  editingDepartment: DepartmentDTO = this.initializeEditingDepartment();
  Departments: DepartmentDTO[] = [];
  selectedDepartmentID: string = '';
  constructor(
    private authService: AuthService,
    private MHOBloc: ManageDepartmentBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeEditingDepartment(): DepartmentDTO {
    return {
      id: '',
      name: ''
    };
  }
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MHOBloc.state$.subscribe(state => {
      this.DepartmentDialog = state.DepartmentDialog;
      this.dialogHeader = state.dialogHeader;
      this.submitted = state.submitted;
      this.editingDepartment = state.editingDepartment || this.initializeEditingDepartment();
      this.Departments = state.Departments;
    });
    this.MHOBloc.eventSubject.next(DataEvent.LoadDepartments);
  }

  openNewDepartmentDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.OpenNewDepartmentDialog);
  }

  deleteSelectedDepartments(): void {
    if (this.selectedDepartments.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected Departments?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const ids = this.selectedDepartments.map(hospital => hospital.id);
          this.MHOBloc.deleteSelectedDepartments(ids);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Selected Departments Deleted',
            life: 3000
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Selected Departments Deletion Cancelled',
            life: 3000
          });
        }
      });
    }
  }

  editDepartment(hospital: DepartmentDTO): void {
    this.MHOBloc.editDepartment(hospital.id);
  }

  deleteDepartment(hospital: DepartmentDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Department?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHOBloc.deleteHospital(hospital.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Department Deleted',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Department Deletion Cancelled',
          life: 3000
        });
      }
    });
  }
  hideDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.HideDepartmentDialog);
  }

  saveDepartment(department: DepartmentDTO) {
    if (department) {
      this.MHOBloc.saveDepartment(department);
    }
  }
}
