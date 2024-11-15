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
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { GeneralManagerDTO } from '../../../models/auth.model';
import { ManageHospitalManagerBloc } from '../../../blocs/HOSPITAL_OWNER/manage-hospital-manager/manage-hospital-manager.bloc';
import { DataEvent } from '../../../blocs/HOSPITAL_OWNER/manage-hospital-manager/manage-hospital-manager.event';
import { AuthService } from '../../../auth/auth.service';
import { HospitalManagerService } from '../../../service/HOSPITAL_OWNER/hospital-manager.servise';
import { MultiSelectModule } from 'primeng/multiselect';
import { HospitalManagerFormComponent } from "../../../forms/HOSPITAL_OWNER/hospital-manager-form/hospital-manager-form.component";

@Component({
  selector: 'app-manage-hospital-manager',
  templateUrl: './manage-hospital-manager.component.html',
  styleUrl: './manage-hospital-manager.component.scss',
  standalone: true,
  imports: [MultiSelectModule, TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, HospitalManagerFormComponent],
  providers: [MessageService, ConfirmationService]
})
export class ManageHospitalManagerComponent {
  GeneralManagerDialog = false;
  AssignDialog = false;
  dialogHeader = '';
  submitted = false;
  currentUserRole: string | null = null;
  selectedGeneralManager: GeneralManagerDTO = this.initializeEditingGeneralManager();
  editingGeneralManager: GeneralManagerDTO = this.initializeEditingGeneralManager();
  GeneralManagers: GeneralManagerDTO[] = [];
  AllGeneralManagers: GeneralManagerDTO[] = [];
  selectedHospitalID: string = '';
  hospitalOptions: { id: string, name: string }[] = [];
  constructor(
    private authService: AuthService,
    private MHMBloc: ManageHospitalManagerBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private hospitalManagerService: HospitalManagerService
  ) { }

  ngOnInit(): void {
    this.initializeData();
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
    this.MHMBloc.state$.subscribe(state => {
      this.GeneralManagerDialog = state.GeneralManagerDialog;
      this.dialogHeader = state.dialogHeader;
      this.submitted = state.submitted;
      this.AssignDialog = state.AssignDialog;
      this.editingGeneralManager = state.editingGeneralManager || this.initializeEditingGeneralManager();
      this.selectedGeneralManager = state.selectedGeneralManager || this.initializeEditingGeneralManager();
      this.GeneralManagers = state.GeneralManagers;
    });
    this.MHMBloc.eventSubject.next(DataEvent.LoadGeneralManagers);
    this.loadGM();
    console.log(this.AllGeneralManagers)
  }

  openNewGeneralManagerDialog(): void {
    this.MHMBloc.eventSubject.next(DataEvent.OpenNewGeneralManagerDialog);
  }
  openNewAssignDialog(): void {
    this.MHMBloc.eventSubject.next(DataEvent.openNewAssignDialog);
    console.log(this.selectedGeneralManager)
  }
  editGeneralManager(generalManager: GeneralManagerDTO): void {
    this.MHMBloc.editGeneralManager(generalManager.id);
  }

  disableGeneralManager(generalManager: GeneralManagerDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this general Manager?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHMBloc.disableGeneralManager(generalManager.id);
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
      message: 'Are you sure you want to enable this general Manager?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHMBloc.enableGeneralManager(generalManager.id);
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
    this.MHMBloc.eventSubject.next(DataEvent.HideGeneralManagerDialog);
  }
  hideAssignDialog(): void {
    this.MHMBloc.eventSubject.next(DataEvent.HideAssignDialog);
  }
  loadGM(): void {
    const HospitalId = this.authService.getCurrentUser()?.hospitalId || '';
    const generalManagers = this.hospitalManagerService.getGeneralManagers();
    if (generalManagers) {
      this.AllGeneralManagers = [];
      generalManagers.forEach(gm => {
        if (gm.hospitalIds && !gm.hospitalIds.includes(HospitalId)) {
          this.AllGeneralManagers.push(gm);
        }
      });
    } else {
      console.error('General manager data is null or undefined');
      this.AllGeneralManagers = [];
    }
  }
  saveGeneralManager(generalManager: GeneralManagerDTO) {
    if (generalManager) {
      this.MHMBloc.saveGeneralManager(generalManager);
    }
  }
  saveAssigningGM() {
    if (this.selectedGeneralManager) {
      try {
        this.MHMBloc.saveAssigningGM(this.selectedGeneralManager);
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
