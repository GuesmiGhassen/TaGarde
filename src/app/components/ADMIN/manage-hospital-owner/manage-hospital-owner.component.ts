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
import { HospitalOwnerDTO } from '../../../models/auth.model';
import { ManageHospitalOwnerBloc } from '../../../blocs/ADMIN/manage-hospital-owners/manage-hospital-owners.bloc';
import { DataEvent } from '../../../blocs/ADMIN/manage-hospital-owners/manage-hospital-owners.event';
import { AuthService } from '../../../auth/auth.service';
import { HospitalService } from '../../../service/ADMIN/hospital.service';
import { HospitalOwnerFormComponent } from "../../../forms/ADMIN/hospital-owner-form/hospital-owner-form.component";
@Component({
  selector: 'app-manage-hospital-owner',
  templateUrl: './manage-hospital-owner.component.html',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, InputNumberModule, HospitalOwnerFormComponent],
  providers: [MessageService, ConfirmationService],
  styleUrl: './manage-hospital-owner.component.scss'
})
export class ManageHospitalOwnerComponent implements OnInit {
  HospitalOwnerDialog = false;
  dialogHeader = '';
  submitted = false;
  currentUserRole: string | null = null;
  selectedHospitalOwners: HospitalOwnerDTO[] = [];
  editingHospitalOwner: HospitalOwnerDTO = this.initializeEditingHospital();
  HospitalOwners: HospitalOwnerDTO[] = [];
  constructor(
    private authService: AuthService,
    private MHOBloc: ManageHospitalOwnerBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private hospitalService: HospitalService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeEditingHospital(): HospitalOwnerDTO {
    return {
      id: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      email: '',
      hospitalId: ' ',
      hospitalName: ''
    };
  }
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MHOBloc.state$.subscribe(state => {
      this.HospitalOwnerDialog = state.HospitalOwnerDialog;
      this.dialogHeader = state.dialogHeader;
      this.submitted = state.submitted;
      this.editingHospitalOwner = state.editingHospitalOwner || this.initializeEditingHospital();
      this.HospitalOwners = state.HospitalOwners;
      this.updateHospitalOwnersWithHospitalNames();
    });
    this.MHOBloc.eventSubject.next(DataEvent.LoadHospitalOwners);
  }

  openNewHospitalOwnerDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.OpenNewHospitalOwnerDialog);
  }

  disableSelectedHospitalOwners(): void {
    if (this.selectedHospitalOwners.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to disable the selected Hospital Owners?',
        header: 'Confirm Disabling',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const ids = this.selectedHospitalOwners.map(hospital => hospital.id);
          this.MHOBloc.disableSelectedHospitalOwners(ids);
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
            detail: 'Selected Hospital Owners Disabled Cancelled',
            life: 3000
          });
        }
      });
    }
  }
  editHospitalOwner(hospital: HospitalOwnerDTO): void {
    this.MHOBloc.editHospitalOwner(hospital.id);
  }

  disableHospitalOwner(hospital: HospitalOwnerDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this hospital Owner?',
      header: 'Confirm Disabling',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHOBloc.disableHospitalOwner(hospital.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Hospital Owner Disabled',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Hospital Owner Disabled Cancelled',
          life: 3000
        });
      }
    });
  }
  enableHospitalOwner(hospital: HospitalOwnerDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this hospital Owner?',
      header: 'Confirm Enabling',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHOBloc.enableHospitalOwner(hospital.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Hospital Owner Enabled',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Hospital Owner Enabled Cancelled',
          life: 3000
        });
      }
    });
  }
  hideDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.HideHospitalOwnerDialog);
  }
  private updateHospitalOwnersWithHospitalNames(): void {
    if (this.HospitalOwners && this.HospitalOwners.length > 0) {
      this.HospitalOwners.forEach(ho => {
        const hospitalId = ho.hospitalId;
        if (hospitalId != '-1') {
          this.hospitalService.getById(hospitalId).subscribe({
            next: response => {
              ho.hospitalName = response.data.name;
              this.HospitalOwners = [...this.HospitalOwners];
            },
            error: err => {
              console.error('Error updating hospital owner with hospital name:', err);
              ho.hospitalName = ''; 
              this.HospitalOwners = [...this.HospitalOwners];
            }
          })
        }
      });
      // sessionStorage.setItem('generalManagersData', JSON.stringify(this.GeneralManagers));
    }
  }
  // GetHospitals(){
  //   this.hospitalService.get().subscribe(response => {
  //     console.log(response.data)
  //     if(response && response.data){
  //       const hospital = response.data.filter(h => h.hospitalOwnerId === null);
  //       console.log(hospital)
  //       this.hospitalOptions = hospital.map(h => ({
  //         id: h.id,
  //         name: h.name
  //       }));
  //       console.log(this.hospitalOptions)
  //     }
  //   })
  // }
  saveHospitalOwner(hospitalOwner: HospitalOwnerDTO) {
    console.log(hospitalOwner)
    if (hospitalOwner) {
      this.MHOBloc.saveHospitalOwner(hospitalOwner);
    }
  }
}