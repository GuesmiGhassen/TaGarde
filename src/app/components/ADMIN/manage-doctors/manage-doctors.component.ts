import { Component, OnInit } from '@angular/core';
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
import { DoctorDTO, specialityDTO } from '../../../models/auth.model';
import { ManageDoctorBloc } from '../../../blocs/ADMIN/manage-doctors/manage-doctors.bloc';
import { DataEvent } from '../../../blocs/ADMIN/manage-doctors/manage-doctors.event';
import { AuthService } from '../../../auth/auth.service';
import { DoctorFormComponent } from "../../../forms/ADMIN/doctor-form/doctor-form.component";
import { SpecialitiesService } from '../../../service/ADMIN/specialities.service';
import { LoadingService } from '../../../service/loading.service';
import { SpinnerComponent } from '../../common/spinner/spinner.component';

@Component({
  selector: 'app-manage-doctors',
  templateUrl: './manage-doctors.component.html',
  styleUrl: './manage-doctors.component.scss',
  standalone: true,
  imports: [SpinnerComponent, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, InputNumberModule, DoctorFormComponent],
  providers: [MessageService, ConfirmationService],
})
export class ManageDoctorsComponent {
  DoctorDialog = false;
  dialogHeader = '';
  submitted = false;
  currentUserRole: string | null = null;
  selectedDoctors: DoctorDTO[] = [];
  editingDoctor: DoctorDTO = this.initializeEditingHospital();
  Doctors: DoctorDTO[] = [];
  HospitalOptions: { id: string, name: string }[] = [];
  Specialities: specialityDTO[] = [];
  selectedHospitalID: string = '0';
  passwordVisible = false;
  constructor(
    private authService: AuthService,
    private MDBloc: ManageDoctorBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private specialityService: SpecialitiesService
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
      this.submitted = state.submitted;
      this.editingDoctor = state.editingDoctor || this.initializeEditingHospital();
      this.Doctors = state.Doctors;
      // this.updateDoctorsWithHospitalNames();
    });
    this.MDBloc.eventSubject.next(DataEvent.LoadDoctors);
  }

  openNewDoctorDialog(): void {
    this.MDBloc.eventSubject.next(DataEvent.OpenNewDoctorDialog);
  }

  disableSelectedDoctors(): void {
    if (this.selectedDoctors.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to disable the selected Hospital Owners?',
        header: 'Confirm Disabling',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const ids = this.selectedDoctors.map(departmentManager => departmentManager.id);
          this.MDBloc.disableSelectedDoctors(ids);
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

  disableDoctor(departmentManager: DoctorDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this doctor?',
      header: 'Confirm Disabling',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MDBloc.disableDoctor(departmentManager.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Doctor Disabled',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Doctor Disabling Cancelled',
          life: 3000
        });
      }
    });
  }
  enableDoctor(departmentManager: DoctorDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to enable this doctor?',
      header: 'Confirm Enbaling',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MDBloc.enableDoctor(departmentManager.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Doctor Enabled',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Doctor Enabling Cancelled',
          life: 3000
        });
      }
    });
  }
  hideDialog(): void {
    this.MDBloc.eventSubject.next(DataEvent.HideDoctorDialog);
  }
  GetSpecialities() {
    this.specialityService.get().subscribe(response => {
      this.Specialities = [...this.Specialities, ...response.data];
    });
  }
  // private updateDoctorsWithHospitalNames(): void {
  //   if (this.Doctors && this.Doctors.length > 0) {
  //     this.Doctors.forEach(doctor => {
  //       const departmentManagerId = doctor.HospitalDepartmentId;
  //       if (departmentManagerId != '-1') {
  //         this.departmentManagerService.getById(departmentManagerId).subscribe({
  //           next: response => {
  //             doctor.departmentManagerName = response.data.name;
  //             this.Doctors = [...this.Doctors];
  //           },
  //           error: err => {
  //             console.error('Error updating departmentManager owner with departmentManager name:', err);
  //             doctor.departmentManagerName = ''; 
  //             this.Doctors = [...this.Doctors];
  //           }
  //         })
  //       }
  //     });
  //     // sessionStorage.setItem('generalManagersData', JSON.stringify(this.GeneralManagers));
  //   }
  // }
  saveDoctor(doctor: DoctorDTO) {
    if (doctor) {
      console.log("DoctorDTO: ",doctor)
      this.MDBloc.saveDoctor(doctor);
    }
  }
}
