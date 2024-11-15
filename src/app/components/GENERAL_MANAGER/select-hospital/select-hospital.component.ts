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
import { HospitalDTO } from '../../../models/auth.model';
import { AuthService } from '../../../auth/auth.service';
import { HospitalDepartmentService } from '../../../service/HOSPITAL_OWNER/hospital-department.service';
import { forkJoin } from 'rxjs';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';


@Component({
  selector: 'app-select-hospital',
  templateUrl: './select-hospital.component.html',
  styleUrl: './select-hospital.component.scss',
  standalone: true,
  imports: [CardModule, TableModule, MultiSelectModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService]
})

export class SelectHospitalComponent {
  selectedHospital!: HospitalDTO;
  Hospitals: HospitalDTO[] = [];
  HospitalIds: string[] = [];
  constructor(
    private router: Router,
    private hospitalDepartmentService: HospitalDepartmentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.HospitalIds = this.authService.getCurrentUser()?.hospitalIds || [];
    this.loadHospitals();
  }
  loadHospitals(): void {
    if (this.HospitalIds && this.HospitalIds.length > 0) {
      const observables = this.HospitalIds.map(id => this.hospitalDepartmentService.getHospitalById(id));
      
      forkJoin(observables).subscribe(hospitals => {
        this.Hospitals = hospitals.map(response => response.data);
      });
    }
  }
  saveHospital(){
    console.log(this.selectedHospital)
    if(this.selectedHospital){
      console.log(this.selectedHospital);
      sessionStorage.setItem('HospitalId',JSON.stringify(this.selectedHospital.id));
      this.router.navigate(['general-manager/Dashboard']);
    }
  }
}
