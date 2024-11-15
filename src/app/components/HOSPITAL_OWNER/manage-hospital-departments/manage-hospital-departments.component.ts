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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DepartmentDTO, HospitalDepartmentDTO } from '../../../models/auth.model';
import { DataEvent } from '../../../blocs/HOSPITAL_OWNER/manage-hospital-departments/manage-hospital-departments.event';
import { AuthService } from '../../../auth/auth.service';
import { ManageHospitalDepartmentsBloc } from '../../../blocs/HOSPITAL_OWNER/manage-hospital-departments/manage-hospital-departments.bloc';
import { HospitalDepartmentService } from '../../../service/HOSPITAL_OWNER/hospital-department.service';
@Component({
  selector: 'app-manage-hospital-departments',
  templateUrl: './manage-hospital-departments.component.html',
  styleUrl: './manage-hospital-departments.component.scss',
  standalone: true,
  imports: [TableModule, MultiSelectModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService]
})
export class ManageHospitalDepartmentsComponent {

  HospitalDepartmentDialog = false;
  dialogHeader = '';
  submitted = false;
  departments!: DepartmentDTO[];
  departmentsToRemove!: DepartmentDTO[];
  currentUserRole: string | null = null;
  selectedHospitalDepartments: HospitalDepartmentDTO[] = [];
  selectedDepartments: DepartmentDTO[] = [];
  HospitalDepartments: HospitalDepartmentDTO[] = [];
  constructor(
    private authService: AuthService,
    private MHOBloc: ManageHospitalDepartmentsBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private hospitalDepartmentService: HospitalDepartmentService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MHOBloc.state$.subscribe(state => {
      this.HospitalDepartmentDialog = state.HospitalDepartmentDialog;
      this.dialogHeader = state.dialogHeader;
      this.submitted = state.submitted;
      this.selectedDepartments = state.selectedDepartments;
      this.HospitalDepartments = state.HospitalDepartments;
    });
    this.MHOBloc.eventSubject.next(DataEvent.LoadHospitalDepartments);
    this.loadDepartments();
  }
  getHospitalId(): string {
    return this.authService.getCurrentUser()?.hospitalId || '';
  }
  openNewHospitalDepartmentDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.OpenNewHospitalDepartmentDialog);
  }
  deleteSelectedHospitalDepartments(): void {
    console.log('Delete', this.selectedHospitalDepartments)
    if (this.selectedHospitalDepartments.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected HospitalDepartments?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const ids: string[] = this.selectedHospitalDepartments.map(hospitalDepartment => hospitalDepartment.id.toString());
          console.log(ids)
          if (ids.length > 0) {
            this.MHOBloc.deleteSelectedHospitalDepartments(ids);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Selected HospitalDepartments Deleted',
              life: 3000
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No valid departments to delete',
              life: 3000
            });
          }
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Selected HospitalDepartments Deletion Cancelled',
            life: 3000
          });
        }
      });
    }
  }

  deleteHospitalDepartment(hospitalDepartment: HospitalDepartmentDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this HospitalDepartment?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHOBloc.deleteHospitalDepartment(hospitalDepartment.departmentDTO.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'HospitalDepartment Deleted',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'HospitalDepartment Deletion Cancelled',
          life: 3000
        });
      }
    });
  }
  hideDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.HideHospitalDepartmentDialog);
  }
  loadDepartments(): void {
    this.hospitalDepartmentService.getAllDepartments().subscribe(departments => {
      this.departments = departments.data;
      this.DepartmentsToRemove();
      const idsToRemove = new Set(this.departmentsToRemove.map(dept => dept.id));
      this.departments = this.departments.filter(department =>
        !idsToRemove.has(department.id)
      );
    });
  }
  DepartmentsToRemove(): void {
    this.departmentsToRemove = this.HospitalDepartments.map(department => department.departmentDTO);
  }
  saveHospitalDepartment() {
    if (this.selectedDepartments) {
      this.MHOBloc.saveHospitalDepartment(this.selectedDepartments);
    }
  }
}
