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
import { DoctorDTO, HospitalDepartmentDTO } from '../../../models/auth.model';
import { DataEvent } from '../../../blocs/HOSPITAL_OWNER/manage-hospital-department-manager/manage-hospital-department-manager.event';
import { AuthService } from '../../../auth/auth.service';
import { ManageHospitalDepartmentManagersBloc } from '../../../blocs/HOSPITAL_OWNER/manage-hospital-department-manager/manage-hospital-department-manager.bloc';
import { DoctorService } from '../../../service/ADMIN/doctor.service';

@Component({
  selector: 'app-manage-hospital-department-manager',
  templateUrl: './manage-hospital-department-manager.component.html',
  styleUrl: './manage-hospital-department-manager.component.scss',
  standalone: true,
  imports: [TableModule, MultiSelectModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService]
})
export class ManageHospitalDepartmentManagerComponent {
  Departments: HospitalDepartmentDTO[] = [];
  Doctors: DoctorDTO[] = [];
  currentUserRole: string | null = null;
  HospitalDepartments: HospitalDepartmentDTO[] = [];
  constructor(
    private authService: AuthService,
    private MHOBloc: ManageHospitalDepartmentManagersBloc,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MHOBloc.state$.subscribe(state => {
      this.HospitalDepartments = state.HospitalDepartments;
    });
    this.MHOBloc.eventSubject.next(DataEvent.LoadHospitalDepartmentManagers);
    this.loadDepartments();
    this.loadDM();
  }
  getHospitalId(): string {
    return this.authService.getCurrentUser()?.hospitalId || '';
  }
  loadDepartments(): void {
    if (this.HospitalDepartments) {
      this.HospitalDepartments.forEach(department => {
        if (!department.departmentManagerDTO){
          this.Departments.push(department);
        }
      })
    }
  }
  loadDM(){
    this.doctorService.get().subscribe(data => {
      const doctor = this.doctorService.filterData(data.data);
      if(doctor[0].HospitalDepartmentId){
        this.Doctors.push(doctor[0]);
      }
    })
  }
}
