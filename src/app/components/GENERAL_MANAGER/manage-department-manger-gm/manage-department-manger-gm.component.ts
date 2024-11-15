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
import { DoctorDTO, HospitalDepartmentDTO, specialityDTO } from '../../../models/auth.model';
import { DataEvent } from '../../../blocs/GENERAL_MANAGER/manage-department-manager-gm/manage-department-manager.event';
import { AuthService } from '../../../auth/auth.service';
import { ManageDepartmentManagerGMBloc } from '../../../blocs/GENERAL_MANAGER/manage-department-manager-gm/manage-department-manager.bloc';
import { DoctorService } from '../../../service/ADMIN/doctor.service';
import { GmDepartmentManagerFormComponent } from "../../../forms/GENERAL_MANAGER/gm-department-manager-form/gm-department-manager-form.component";
import { SpecialitiesService } from '../../../service/ADMIN/specialities.service';

@Component({
  selector: 'app-manage-department-manger-gm',
  templateUrl: './manage-department-manger-gm.component.html',
  styleUrl: './manage-department-manger-gm.component.scss',
  standalone: true,
  imports: [TableModule, MultiSelectModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, GmDepartmentManagerFormComponent],
  providers: [MessageService, ConfirmationService]
})
export class ManageDepartmentMangerGmComponent {
  NewAssignDialog = false;
  NewDepartmentManagerDialog = false;
  EditDialog = false;
  dialogHeader = '';
  submitted = false;
  Departments: HospitalDepartmentDTO[] = [];
  editingDepartmentManager: DoctorDTO = this.initializeEditingDepartmentManager();
  Doctors: DoctorDTO[] = [];
  currentUserRole: string | null = null;
  selectedHospitalDepartmentManagers!: DoctorDTO;
  selectedDepartments!: HospitalDepartmentDTO;
  HospitalDepartments: HospitalDepartmentDTO[] = [];
  Specialities: specialityDTO[] = [];
  constructor(
    private authService: AuthService,
    private MHOBloc: ManageDepartmentManagerGMBloc,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private doctorService: DoctorService,
    private specialityService: SpecialitiesService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }
  private initializeData(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.MHOBloc.state$.subscribe(state => {
      this.NewAssignDialog = state.NewAssignDialog;
      this.NewDepartmentManagerDialog = state.NewDepartmentManagerDialog;
      this.EditDialog = state.EditDialog;
      this.editingDepartmentManager = state.editingDepartmentManager || this.initializeEditingDepartmentManager();
      this.dialogHeader = state.dialogHeader;
      this.submitted = state.submitted;
      // this.selectedDepartments = state.selectedDepartments;
      this.HospitalDepartments = state.HospitalDepartments;
    });
    this.MHOBloc.eventSubject.next(DataEvent.LoadHospitalDepartmentManagers);
    this.loadDepartments();
    this.loadDM();
    this.GetSpecialities();
  }
  private initializeEditingDepartmentManager(): DoctorDTO{
    return{
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
      HospitalDepartmentId:''
    }
  }
  getHospitalId(): string {
    return this.authService.getCurrentUser()?.hospitalId || '';
  }
  openNewDepartmentManagerDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.OpenNewDepartmentManagerDialog);
  }
  openNewAssignDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.OpenNewAssignDialog);
  }
  editDepartmentManager(departmentManager: DoctorDTO): void {
    this.MHOBloc.editDepartmentManager(departmentManager.id);
  }

  deleteHospitalDepartmentManager(hospitalDepartment: HospitalDepartmentDTO): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this HospitalDepartmentManager?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHOBloc.deleteHospitalDepartmentManager(hospitalDepartment.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'HospitalDepartmentManager Deleted',
          life: 3000
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'HospitalDepartmentManager Deletion Cancelled',
          life: 3000
        });
      }
    });
  }
  disableDepartmentManager(departmentManager: DoctorDTO): void {
    console.log(departmentManager.id)
    this.confirmationService.confirm({
      message: 'Are you sure you want to disable this general Manager?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHOBloc.disableDepartmentManager(departmentManager.id);
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
  enableDepartmentManager(departmentManager: DoctorDTO): void {
    console.log(departmentManager)
    this.confirmationService.confirm({
      message: 'Are you sure you want to enable this general Manager?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.MHOBloc.enableDepartmentManager(departmentManager.id);
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
  GetSpecialities() {
    this.specialityService.get().subscribe(response => {
      this.Specialities = [...this.Specialities, ...response.data];
    });
  }
  hideAssignDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.HideNewAssignDialog);
  }
  hideDepartmentManagerDialog(): void {
    this.MHOBloc.eventSubject.next(DataEvent.HideNewDepartmentManagerDialog);
  }

  loadDepartments(): void {
    console.log(this.HospitalDepartments)
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
      if(doctor[0]?.HospitalDepartmentId){
        this.Doctors.push(doctor[0]);
      }
    })
  }
 saveDM(departmentManager: DoctorDTO){
  if(departmentManager){
    this.MHOBloc.saveNewDM(departmentManager);
  }
 }
  saveAssignDM() {
    if (this.selectedDepartments && this.selectedHospitalDepartmentManagers) {
      console.log(this.selectedDepartments.id)
      console.log(this.selectedHospitalDepartmentManagers)
      this.MHOBloc.saveAssignDM(this.selectedDepartments.id,this.selectedHospitalDepartmentManagers.id);
    }
  }
}
