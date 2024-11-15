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
import { GeneralManagerDTO, HospitalDTO, HospitalOwnerDTO } from '../../../models/auth.model';
import { ManageHospitalBloc } from '../../../blocs/ADMIN/manage-hospitals/manage-hospitals.bloc';
import { DataEvent } from '../../../blocs/ADMIN/manage-hospitals/manage-hospitals.event';
import { AuthService } from '../../../auth/auth.service';
import { HospitalFormComponent } from "../../../forms/ADMIN/hospital-form/hospital-form.component";
import { HospitalOwnerService } from '../../../service/ADMIN/hospital-owner.service';
import { catchError, of } from 'rxjs';
import { GeneralManagerService } from '../../../service/ADMIN/general-manager.service';

@Component({
  selector: 'app-Manage-Hospitals',
  templateUrl: './ManageHospitals.component.html',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, InputNumberModule, HospitalFormComponent],
  providers: [MessageService, ConfirmationService],
  styleUrl: './ManageHospitals.component.scss'
})
export class TemplateComponent implements OnInit {
  HospitalDialog = false;
  dialogHeader = '';
  submitted = false;
  bool = false;
  currentUserRole: string | null = null;
  selectedHospitals: HospitalDTO[] = [];
  editingHospital: HospitalDTO = this.initializeEditingHospital();
  formData: HospitalDTO = this.initializeEditingHospital();
  Hospitals: HospitalDTO[] = [];
  HospitalOwnerOptions: HospitalOwnerDTO[] = [];
  GeneralManagerOptions: GeneralManagerDTO[] = [];
  selectedHospitalOwnerID: string = '';
  selectedGeneralManagerID: string = '';

  formOptions = {
    hospitalOwners: [{ id: 1, name: 'Owner 1' }, { id: 2, name: 'Owner 2' }],
    generalManagers: [{ id: 1, name: 'Manager 1' }, { id: 2, name: 'Manager 2' }]
  };
  constructor(
    private authService: AuthService,
    private MHBloc: ManageHospitalBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private hospitalOwnerService: HospitalOwnerService,
    private generalManagerService: GeneralManagerService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeEditingHospital(): HospitalDTO {
    return {
      id: '',
      name: '',
      phone: '',
      address: '',
      email: '',
      hospitalOwnerId: '',
      generalManagerId: ''
    };
  }

  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MHBloc.state$.subscribe(state => {
      this.HospitalDialog = state.HospitalDialog;
      this.dialogHeader = state.dialogHeader;
      this.submitted = state.submitted;
      this.editingHospital = state.editingHospital || this.initializeEditingHospital();
      this.Hospitals = state.Hospitals;
      this.selectedHospitalOwnerID = this.editingHospital.hospitalOwnerId;
      this.selectedGeneralManagerID = this.editingHospital.generalManagerId;
    });
    this.MHBloc.eventSubject.next(DataEvent.LoadHospitals);
    this.GetHospitalOwners();
    this.GetGeneralManagers();
  }

  openNewHospitalDialog(): void {
    this.MHBloc.eventSubject.next(DataEvent.OpenNewHospitalDialog);
  }

  deleteSelectedHospitals(): void {
    if (this.selectedHospitals.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected hospitals?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const ids = this.selectedHospitals.map(hospital => hospital.id);
          this.MHBloc.deleteSelectedHospitals(ids);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Selected Hospitals Deleted',
            life: 3000
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Selected Hospitals Deletion Cancelled',
            life: 3000
          });
        }
      });
    }
  }

  editHospital(hospital: HospitalDTO): void {
    this.MHBloc.editHospital(hospital.id);
  }
  deleteHospital(hospital: HospitalDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this hospital?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHBloc.deleteHospital(hospital.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Hospital Deleted',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Hospital Deletion Cancelled',
          life: 3000
        });
      }
    });
  }
  hideDialog(): void {
    this.MHBloc.eventSubject.next(DataEvent.HideHospitalDialog);
  }
  GetHospitalOwners() {
    this.hospitalOwnerService.get()
      .pipe(
        catchError(error => {
          console.error('Error fetching hospital owners:', error);
          return of(null);
        })
      )
      .forEach(response => {
        if (response && response.data) {
          const HospitalOwners = this.hospitalOwnerService.filterData(response.data);
          if (HospitalOwners && HospitalOwners.length > 0) {
            HospitalOwners.forEach(HospitalOwner => {
              const hospitalId = HospitalOwner.hospitalId;
              if (hospitalId == "-1") {
                this.HospitalOwnerOptions.push(HospitalOwner);
              }
            });
          }
        }
      });
  }
  GetGeneralManagers() {
    this.generalManagerService.get()
      .pipe(
        catchError(error => {
          console.error('Error fetching general managers:', error);
          return of(null);
        })
      )
      .forEach(response => {
        if (response && response.data) {
          const GeneralManagers = this.generalManagerService.filterData(response.data);
          if (GeneralManagers && GeneralManagers.length > 0) {
            GeneralManagers.forEach(GeneralManager => {
              this.GeneralManagerOptions.push(GeneralManager);
            });
          }
        }
      });
  }
  saveHospital(hospital: HospitalDTO) {
    if (hospital) {
      console.log('Save :', hospital)
      this.MHBloc.saveHospital(hospital);
    }
  }
}