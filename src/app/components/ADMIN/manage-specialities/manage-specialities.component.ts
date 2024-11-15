import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { specialityDTO } from '../../../models/auth.model';
import { DataEvent } from '../../../blocs/ADMIN/manage-specialities/manage-specialities.event';
import { AuthService } from '../../../auth/auth.service';
import { ManageSpecialityBloc } from '../../../blocs/ADMIN/manage-specialities/manage-specialities.bloc';


@Component({
  selector: 'app-manage-specialities',
  templateUrl: './manage-specialities.component.html',
  styleUrl: './manage-specialities.component.scss',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, FormsModule, ToolbarModule, ConfirmDialogModule, InputTextModule, CommonModule, DropdownModule, InputTextModule, InputNumberModule],
  providers: [MessageService, ConfirmationService]
})
export class ManageSpecialitiesComponent {
  SpecialityDialog = false;
  dialogHeader = '';
  submitted = false;
  currentUserRole: string | null = null;
  selectedSpecialities: specialityDTO[] = [];
  editingSpeciality: specialityDTO = this.initializeEditingSpeciality();
  Specialities: specialityDTO[] = [];
  selectedSpecialityID: string = '';
  constructor(
    private authService: AuthService,
    private MHOBloc: ManageSpecialityBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeEditingSpeciality(): specialityDTO {
    return {
      id: '',
      specialityName: ''
    };
  }
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MHOBloc.state$.subscribe(state => {
      this.SpecialityDialog = state.SpecialityDialog;
      this.dialogHeader = state.dialogHeader;
      this.submitted = state.submitted;
      this.editingSpeciality = state.editingSpeciality || this.initializeEditingSpeciality();
      this.Specialities = state.Specialities;
    });
    this.MHOBloc.eventSubject.next(DataEvent.LoadSpecialities);
  }

  openNewSpecialityDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.OpenNewSpecialityDialog);
  }

  deleteSelectedSpecialities(): void {
    if (this.selectedSpecialities.length > 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected Specialities?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const ids = this.selectedSpecialities.map(hospital => hospital.id);
          this.MHOBloc.deleteSelectedSpecialities(ids);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Selected Specialities Deleted',
            life: 3000
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Selected Specialities Deletion Cancelled',
            life: 3000
          });
        }
      });
    }
  }

  editSpeciality(hospital: specialityDTO): void {
    this.MHOBloc.editSpeciality(hospital.id);
  }

  deleteSpeciality(hospital: specialityDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Speciality?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHOBloc.deleteHospital(hospital.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Speciality Deleted',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Speciality Deletion Cancelled',
          life: 3000
        });
      }
    });
  }
  hideDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.HideSpecialityDialog);
  }

  saveSpeciality(department: specialityDTO) {
    if (department) {
      this.MHOBloc.saveSpeciality(department);
    }
  }

}
