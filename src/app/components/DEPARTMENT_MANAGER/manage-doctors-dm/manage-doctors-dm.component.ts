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
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DoctorDTO, specialityDTO } from '../../../models/auth.model';
import { ManageDoctorsDMBloc } from '../../../blocs/DEPARTMENT_MANAGER/manage-doctors-dm/manage-doctors-dm.bloc';
import { DataEvent } from '../../../blocs/DEPARTMENT_MANAGER/manage-doctors-dm/manage-doctors-dm.event';
import { AuthService } from '../../../auth/auth.service';
import { SpecialitiesService } from '../../../service/ADMIN/specialities.service';
import { DMManageDoctorsFormComponent } from "../../../forms/DEPARTMENT_MANAGER/dm-manage-doctors-form/dm-manage-doctors-form.component";
import { DoctorService } from '../../../service/ADMIN/doctor.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-manage-doctors-dm',
  templateUrl: './manage-doctors-dm.component.html',
  styleUrl: './manage-doctors-dm.component.scss',
  standalone: true,
  imports: [FormsModule, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, InputNumberModule, DMManageDoctorsFormComponent],
  providers: [MessageService, ConfirmationService]
})
export class ManageDoctorsDmComponent {
  DoctorDialog = false;
  AssignDialog = false;
  dialogHeader = '';
  submitted = false;
  currentUserRole: string | null = null;
  selectedDoctors: DoctorDTO[] = [];
  editingDoctor: DoctorDTO = this.initializeEditingHospital();
  Doctors: DoctorDTO[] = [];
  HospitalOptions: { id: string, name: string }[] = [];
  Specialities: specialityDTO[] = [];
  AllDoctors: DoctorDTO[] = [];
  selectDoctors: DoctorDTO = this.initializeEditingHospital();
  selectedHospitalID: string = '0';
  passwordVisible = false;
  constructor(
    private authService: AuthService,
    private MDBloc: ManageDoctorsDMBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private specialityService: SpecialitiesService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.GetSpecialities();
  }

  private initializeEditingHospital(): DoctorDTO {
    return {
      id: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      email: '',
      dateOfBirth: '',
      codeCNOM: '',
      codeCNAM: '',
      specialityId: '',
      HospitalDepartmentId: ''
    };
  }
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MDBloc.state$.subscribe(state => {
      this.DoctorDialog = state.DoctorDialog;
      this.dialogHeader = state.dialogHeader;
      this.AssignDialog = state.AssignDialog;
      this.submitted = state.submitted;
      this.editingDoctor = state.editingDoctor || this.initializeEditingHospital();
      this.Doctors = state.Doctors;
    });
    this.MDBloc.eventSubject.next(DataEvent.LoadDoctors);
    this.LoadDoctors();
  }

  openNewDoctorDialog(): void {
    this.MDBloc.eventSubject.next(DataEvent.OpenNewDoctorDialog);
  }
  openNewAssignDialog(): void {
    this.MDBloc.eventSubject.next(DataEvent.OpenNewAssignDialog);
  }

  disableSelectedDoctors(): void {
    if (this.selectedDoctors.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to disable the selected Hospital Owners?',
        header: 'Confirm Disabling',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const ids = this.selectedDoctors.map(departmentManager => departmentManager.id);
          this.MDBloc.deleteSelectedDoctors(ids);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Selected Hospital Owners Disabled',
            life: 3000
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Selected Hospital Owners Disabling Cancelled',
            life: 3000
          });
        }
      });
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  editDoctor(departmentManager: DoctorDTO): void {
    this.MDBloc.editDoctor(departmentManager.id);
  }

  deleteDoctor(departmentManager: DoctorDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this doctor?',
      header: 'Confirm Disabling',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MDBloc.deleteDoctor(departmentManager.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Doctor Disabled',
          life: 5000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Doctor Disabling Cancelled',
          life: 5000
        });
      }
    });
  }

  hideDialog(): void {
    this.MDBloc.eventSubject.next(DataEvent.HideDoctorDialog);
  }
  hideAssignDialog(): void {
    this.MDBloc.eventSubject.next(DataEvent.HideAssignDialog);
  }
  LoadDoctors() {
    this.doctorService.get()
      .pipe(
        catchError(error => {
          console.error('Error fetching doctors:', error);
          return of(null);
        })
      )
      .forEach(response => {
        if (response && response.data) {
          const Doctors = this.doctorService.filterData(response.data);
          if (Doctors && Doctors.length > 0) {
            Doctors.forEach(doctor => {
              this.AllDoctors.push(doctor);
            });
          }
        }
      });
  }

  GetSpecialities() {
    this.specialityService.get().subscribe(response => {
      this.Specialities = [...this.Specialities, ...response.data];
    });
  }
  saveDoctor(doctor: DoctorDTO) {
    if (doctor) {
      this.MDBloc.saveDoctor(doctor);
    }
  }
  saveAssigningGM() {
    if (this.selectDoctors) {
      try {
        this.MDBloc.saveAssigningDoctor(this.selectDoctors);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'General Manager assigned successfully',
          life: 3000
        });
        this.hideAssignDialog();
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to assign General Manager',
          life: 3000
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No General Manager selected',
        life: 3000
      });
    }
  }
}
