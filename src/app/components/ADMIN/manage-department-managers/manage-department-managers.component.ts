import { Component } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
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
import { ManageDepartmentManagerBloc } from '../../../blocs/ADMIN/manage-department-managers/manage-department-managers.bloc';
import { DataEvent } from '../../../blocs/ADMIN/manage-department-managers/manage-department-managers.event';
import { AuthService } from '../../../auth/auth.service';
import { HospitalService } from '../../../service/ADMIN/hospital.service';
import { DepartmentManagerFormComponent } from "../../../forms/ADMIN/department-manager-form/department-manager-form.component";
import { SpecialitiesService } from '../../../service/ADMIN/specialities.service';

@Component({
  selector: 'app-manage-department-managers',
  templateUrl: './manage-department-managers.component.html',
  styleUrl: './manage-department-managers.component.scss',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, InputNumberModule, DepartmentManagerFormComponent],
  providers: [MessageService, ConfirmationService]
})
export class ManageDepartmentManagersComponent {
  DepartmentManagerDialog = false;
  dialogHeader = '';
  submitted = false;
  currentUserRole: string | null = null;
  selectedDepartmentManagers: DoctorDTO[] = [];
  editingDepartmentManager: DoctorDTO = this.initializeEditingDepartmentManager();
  DepartmentManagers: DoctorDTO[] = [];
  selectedHospitalID: string = '';
  hospitalOptions: { id: string, name: string }[] = [];
  Specialities: specialityDTO[] = [];
  constructor(
    private authService: AuthService,
    private MDMBloc: ManageDepartmentManagerBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private hospitalService: HospitalService,
    private specialityService: SpecialitiesService
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.loadHospitals();
    this.GetSpecialities();
  }

  private initializeEditingDepartmentManager(): DoctorDTO {
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
      hospitalDepartmentToManageId: ''
    };
  }
  
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MDMBloc.state$.subscribe(state => {
      this.DepartmentManagerDialog = state.DepartmentManagerDialog;
      this.dialogHeader = state.dialogHeader;
      this.submitted = state.submitted;
      this.editingDepartmentManager = state.editingDepartmentManager || this.initializeEditingDepartmentManager();
      this.DepartmentManagers = state.DepartmentManagers;
      // this.updateDepartmentManagersWithHospitalNames();
    });
    this.MDMBloc.eventSubject.next(DataEvent.LoadDepartmentManagers);
  }

  openNewDepartmentManagerDialog(): void {
    this.MDMBloc.eventSubject.next(DataEvent.OpenNewDepartmentManagerDialog);
  }

  disableSelectedDepartmentManagers(): void {
    if (this.selectedDepartmentManagers.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to disable the selected Department Managers?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const ids = this.selectedDepartmentManagers.map(departmentManager => departmentManager.id);
          this.MDMBloc.disableSelectedDepartmentManagers(ids);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Selected Department Managers Deleted',
            life: 3000
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Selected Department Managers Deletion Cancelled',
            life: 3000
          });
        }
      });
    }
  }

  editDepartmentManager(departmentManager: DoctorDTO): void {
    this.MDMBloc.editDepartmentManager(departmentManager.id);
  }

  disableDepartmentManager(departmentManager: DoctorDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this Department Manager?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MDMBloc.disableDepartmentManager(departmentManager.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Department Manager Deleted',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Department Manager Deletion Cancelled',
          life: 3000
        });
      }
    });
  }
  enableDepartmentManager(departmentManager: DoctorDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to enable this Department Manager?',
      header: 'Confirm Enbaling',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MDMBloc.enableDepartmentManager(departmentManager.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Department Manager Enabled',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Department Manager Enabling Cancelled',
          life: 3000
        });
      }
    });
  }
  hideDialog(): void {
    this.MDMBloc.eventSubject.next(DataEvent.HideDepartmentManagerDialog);
  }
  GetSpecialities() {
    this.specialityService.get().subscribe(response => {
      this.Specialities = [...this.Specialities, ...response.data];
    });
  }
  loadHospitals(): void {
    this.hospitalService.get().subscribe(
      response => {
        if (response && response.data) {
          this.hospitalOptions = response.data.map(hospital => ({
            name: hospital.name,
            id: hospital.id
          }));
        }
      },
      error => {
        console.error('Error loading hospitals:', error);
      }
    );
  }
  // private updateDepartmentManagersWithHospitalNames(): void {
  //   if (this.DepartmentManagers && this.DepartmentManagers.length > 0) {
  //     this.DepartmentManagers.forEach(gm => {
  //       if (gm.hospitalIds && gm.hospitalIds.length > 0) {
  //         this.fetchHospitalNames(gm.hospitalIds).subscribe({
  //           next: names => {
  //             gm.hospitalName = names;
  //             this.DepartmentManagers = [...this.DepartmentManagers];
  //           },
  //           error: err => {
  //             console.error('Error updating general manager with hospital names:', err);
  //             gm.hospitalName = [];
  //             this.DepartmentManagers = [...this.DepartmentManagers];
  //           }
  //         });
  //       }
  //     });
  //   }
  // }
  private fetchHospitalNames(hospitalIds: string[]): Observable<string[]> {
    const nameRequests = hospitalIds.map(id => this.hospitalService.getById(id));
    return forkJoin(nameRequests).pipe(
      map(responses => {
        return responses.flatMap(response => {
          if (response && response.data) {
            return response.data.name;
          } else {
            console.error('Unexpected response format:', response);
            return [];
          }
        });
      }),
      catchError(err => {
        console.error('Error fetching hospital names:', err);
        return of([]);
      })
    );
  }
  saveDepartmentManager(departmentManager: DoctorDTO) {
    if (departmentManager) {
      this.MDMBloc.saveDepartmentManager(departmentManager);
    }
  }
}
