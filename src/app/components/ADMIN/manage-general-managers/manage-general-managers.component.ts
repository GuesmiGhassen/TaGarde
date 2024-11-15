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
import { GeneralManagerDTO } from '../../../models/auth.model';
import { ManageGeneralManagerBloc } from '../../../blocs/ADMIN/manage-general-managers/manage-general-managers.bloc';
import { DataEvent } from '../../../blocs/ADMIN/manage-general-managers/manage-general-managers.event';
import { AuthService } from '../../../auth/auth.service';
import { HospitalService } from '../../../service/ADMIN/hospital.service';
import { GeneralManagerFormComponent } from "../../../forms/ADMIN/general-manager-form/general-manager-form.component";

@Component({
  selector: 'app-manage-general-managers',
  templateUrl: './manage-general-managers.component.html',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, InputNumberModule, GeneralManagerFormComponent],
  providers: [MessageService, ConfirmationService],
  styleUrl: './manage-general-managers.component.scss'
})

export class ManageGeneralManagersComponent {
  GeneralManagerDialog = false;
  dialogHeader = '';
  submitted = false;
  currentUserRole: string | null = null;
  selectedGeneralManagers: GeneralManagerDTO[] = [];
  editingGeneralManager: GeneralManagerDTO = this.initializeEditingGeneralManager();
  GeneralManagers: GeneralManagerDTO[] = [];
  selectedHospitalID: string = '';
  hospitalOptions: { id: string, name: string }[] = [];
  passwordVisible = false;
  constructor(
    private authService: AuthService,
    private MGMBloc: ManageGeneralManagerBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private hospitalService: HospitalService
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.loadHospitals();
  }

  private initializeEditingGeneralManager(): GeneralManagerDTO {
    return {
      id: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      email: '',
      hospitalIds: [],
      hospitalName: []
    };
  }
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MGMBloc.state$.subscribe(state => {
      this.GeneralManagerDialog = state.GeneralManagerDialog;
      this.dialogHeader = state.dialogHeader;
      this.submitted = state.submitted;
      this.editingGeneralManager = state.editingGeneralManager || this.initializeEditingGeneralManager();
      this.GeneralManagers = state.GeneralManagers;
      this.updateGeneralManagersWithHospitalNames();
    });
    this.MGMBloc.eventSubject.next(DataEvent.LoadGeneralManagers);
  }

  openNewGeneralManagerDialog(): void {
    this.MGMBloc.eventSubject.next(DataEvent.OpenNewGeneralManagerDialog);
  }

  disableSelectedGeneralManagers(): void {
    if (this.selectedGeneralManagers.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to disable the selected General Managers?',
        header: 'Confirm Disabling',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const ids = this.selectedGeneralManagers.map(generalManager => generalManager.id);
          this.MGMBloc.disableSelectedGeneralManagers(ids);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Selected General Managers Disabled',
            life: 3000
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Selected General Managers Disabling Cancelled',
            life: 3000
          });
        }
      });
    }
  }

  editGeneralManager(generalManager: GeneralManagerDTO): void {
    this.MGMBloc.editGeneralManager(generalManager.id);
  }

  disableGeneralManager(generalManager: GeneralManagerDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this general Manager?',
      header: 'Confirm Disabling',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MGMBloc.disableGeneralManager(generalManager.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'General Manager Disabled',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'General Manager Disabling Cancelled',
          life: 3000
        });
      }
    });
  }
  enableGeneralManager(generalManager: GeneralManagerDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to enabled this general Manager?',
      header: 'Confirm Enabling',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MGMBloc.enableGeneralManager(generalManager.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'General Manager Enabled',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'General Manager Enabling Cancelled',
          life: 3000
        });
      }
    });
  }
  hideDialog(): void {
    this.MGMBloc.eventSubject.next(DataEvent.HideGeneralManagerDialog);
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
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
  private updateGeneralManagersWithHospitalNames(): void {
    if (this.GeneralManagers && this.GeneralManagers.length > 0) {
      this.GeneralManagers.forEach(gm => {
        if (gm.hospitalIds && gm.hospitalIds.length > 0) {
          this.fetchHospitalNames(gm.hospitalIds).subscribe({
            next: names => {
              gm.hospitalName = names;
              this.GeneralManagers = [...this.GeneralManagers];
            },
            error: err => {
              console.error('Error updating general manager with hospital names:', err);
              gm.hospitalName = [];
              this.GeneralManagers = [...this.GeneralManagers];
            }
          });
        }
      });
      // sessionStorage.setItem('generalManagersData', JSON.stringify(this.GeneralManagers));
    }
  }
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
  saveGeneralManager(generalManager: GeneralManagerDTO) {
    if (generalManager) {
      console.log(generalManager)
      this.MGMBloc.saveGeneralManager(generalManager);
    }
  }
}