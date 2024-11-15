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
import { DataEvent } from '../../../blocs/HOSPITAL_OWNER/manage-department-doctors/manage-department-doctors.event';
import { AuthService } from '../../../auth/auth.service';
import { HospitalDepartmentService } from '../../../service/HOSPITAL_OWNER/hospital-department.service';
import { ManageDepartmentDoctorsBloc } from '../../../blocs/HOSPITAL_OWNER/manage-department-doctors/manage-department-doctors.bloc';
import { SelectHospitalComponent } from "../../GENERAL_MANAGER/select-hospital/select-hospital.component";

@Component({
  selector: 'app-manage-department-doctors',
  templateUrl: './manage-department-doctors.component.html',
  styleUrl: './manage-department-doctors.component.scss',
  standalone: true,
  imports: [MultiSelectModule, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, SelectHospitalComponent],
  providers: [MessageService, ConfirmationService]
})
export class ManageDepartmentDoctorsComponent {
  departments!: DepartmentDTO[];
  departmentsToRemove!: DepartmentDTO[];
  currentUserRole: string | null = null;
  HospitalDepartments: HospitalDepartmentDTO[] = [];
  constructor(
    private authService: AuthService,
    private MHOBloc: ManageDepartmentDoctorsBloc,
    private hospitalDepartmentService: HospitalDepartmentService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MHOBloc.state$.subscribe(state => {
      this.HospitalDepartments = state.HospitalDepartments;
    });
    
    this.MHOBloc.eventSubject.next(DataEvent.LoadHospitalDepartments);
    this.loadDepartments();
  }
  getHospitalId(): string {
    return this.authService.getCurrentUser()?.hospitalId || '';
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

}
