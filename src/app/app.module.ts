import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS, withInterceptors, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { MatMenuModule } from '@angular/material/menu';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomepageComponent } from './components/common/homepage/homepage.component';
import { TemplateComponent } from './components/ADMIN/manage-hospitals/ManageHospitals.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ManageHospitalOwnerComponent } from './components/ADMIN/manage-hospital-owner/manage-hospital-owner.component';
import { ButtonModule } from 'primeng/button';
import { API_URL_TOKEN, STORAGE_KEY_TOKEN, ROLE } from './service/api-tokens';
import { ManageDepartmentsComponent } from './components/ADMIN/manage-departments/manage-departments.component';
import { ManageGeneralManagersComponent } from './components/ADMIN/manage-general-managers/manage-general-managers.component';
// import { HospitalFormComponent } from './components/common/hospital-form/hospital-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ManageDoctorsComponent } from './components/ADMIN/manage-doctors/manage-doctors.component';
import { ManageDepartmentManagersComponent } from './components/ADMIN/manage-department-managers/manage-department-managers.component';
import { ManageHospitalDepartmentsComponent } from './components/HOSPITAL_OWNER/manage-hospital-departments/manage-hospital-departments.component';
import { ManageHospitalManagerComponent } from './components/HOSPITAL_OWNER/manage-hospital-manager/manage-hospital-manager.component';
import { ManageHospitalDepartmentManagerComponent } from './components/HOSPITAL_OWNER/manage-hospital-department-manager/manage-hospital-department-manager.component';
import { ManageDepartmentDoctorsComponent } from './components/HOSPITAL_OWNER/manage-department-doctors/manage-department-doctors.component';
import { ManageDepartmentGMComponent } from './components/GENERAL_MANAGER/manage-department-gm/manage-department-gm.component';
import { SelectHospitalComponent } from './components/GENERAL_MANAGER/select-hospital/select-hospital.component';
import { ManageDepartmentMangerGmComponent } from './components/GENERAL_MANAGER/manage-department-manger-gm/manage-department-manger-gm.component';
import { HospitalOwnerFormComponent } from './forms/ADMIN/hospital-owner-form/hospital-owner-form.component';
import { HospitalFormComponent } from './forms/ADMIN/hospital-form/hospital-form.component';
import { GeneralManagerFormComponent } from './forms/ADMIN/general-manager-form/general-manager-form.component';
import { DepartmentFormComponent } from './forms/ADMIN/department-form/department-form.component';
import { DoctorFormComponent } from './forms/ADMIN/doctor-form/doctor-form.component';
import { ManageSpecialitiesComponent } from './components/ADMIN/manage-specialities/manage-specialities.component';
import { DepartmentManagerFormComponent } from './forms/ADMIN/department-manager-form/department-manager-form.component';
import { HospitalManagerFormComponent } from './forms/HOSPITAL_OWNER/hospital-manager-form/hospital-manager-form.component';
import { GmDepartmentManagerFormComponent } from './forms/GENERAL_MANAGER/gm-department-manager-form/gm-department-manager-form.component';
import { AdminProfileComponent } from './components/ADMIN/admin-profile/admin-profile.component';
import { HospitalOwnerProfileComponent } from './components/HOSPITAL_OWNER/hospital-owner-profile/hospital-owner-profile.component';
import { GeneralManagerProfileComponent } from './components/GENERAL_MANAGER/general-manager-profile/general-manager-profile.component';
import { DepartmentManagerProfileComponent } from './components/DEPARTMENT_MANAGER/department-manager-profile/department-manager-profile.component';
import { DoctorProfileComponent } from './components/DOCTOR/doctor-profile/doctor-profile.component';
import { ManageDoctorsDmComponent } from './components/DEPARTMENT_MANAGER/manage-doctors-dm/manage-doctors-dm.component';
import { DMManageDoctorsFormComponent } from './forms/DEPARTMENT_MANAGER/dm-manage-doctors-form/dm-manage-doctors-form.component';
import { SpinnerComponent } from './components/common/spinner/spinner.component';
import { GenerateScheduleComponent } from './components/DEPARTMENT_MANAGER/manage-schedule/generate-schedule/generate-schedule.component';
import { ScheduleComponent } from './components/DEPARTMENT_MANAGER/manage-schedule/schedule/schedule.component';
import { ScheduleOptionsComponent } from './components/DEPARTMENT_MANAGER/manage-schedule/schedule-options/schedule-options.component';
import { DoctorScheduleComponent } from './components/DOCTOR/doctor-schedule/doctor-schedule.component';
import { LoadingInterceptor } from './interceptor/loading.interceptor';
import { AuthInterceptor } from './interceptor/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    LayoutModule,
    RatingModule,
    FormsModule,
    ManageHospitalOwnerComponent,
    ManageDepartmentsComponent,
    ManageGeneralManagersComponent,
    TagModule,
    ReactiveFormsModule,
    RouterModule,
    TemplateComponent,
    ButtonModule,
    DropdownModule,
    DialogModule,
    HospitalFormComponent,
    ManageDoctorsComponent,
    ManageDepartmentManagersComponent,
    ManageHospitalDepartmentsComponent,
    MultiSelectModule,
    SignInComponent,
    ManageHospitalManagerComponent,
    ManageHospitalDepartmentManagerComponent,
    ManageDepartmentDoctorsComponent,
    ManageDepartmentGMComponent,
    SelectHospitalComponent,
    ManageDepartmentMangerGmComponent,
    ToastModule,
    HospitalOwnerFormComponent,
    HospitalFormComponent,
    GeneralManagerFormComponent,
    DepartmentFormComponent,
    DoctorFormComponent,
    ManageSpecialitiesComponent,
    DepartmentManagerFormComponent,
    HospitalManagerFormComponent,
    GmDepartmentManagerFormComponent,
    AdminProfileComponent,
    HospitalOwnerProfileComponent,
    GeneralManagerProfileComponent,
    DepartmentManagerProfileComponent,
    DoctorProfileComponent,
    ManageDoctorsDmComponent,
    DMManageDoctorsFormComponent,
    SpinnerComponent,
    GenerateScheduleComponent,
    ScheduleOptionsComponent,
    ScheduleComponent,
    DoctorScheduleComponent,
    HttpClientModule
],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    AuthService,
    { provide: API_URL_TOKEN, useValue: '' },
    { provide: STORAGE_KEY_TOKEN, useValue: '' },
    { provide: ROLE, useValue: '' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
