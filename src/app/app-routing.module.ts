import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { SignInComponent } from './auth/sign-in/sign-in.component';
import { HomepageComponent } from './components/common/homepage/homepage.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

import { TemplateComponent } from './components/ADMIN/manage-hospitals/ManageHospitals.component';
import { ManageHospitalOwnerComponent } from './components/ADMIN/manage-hospital-owner/manage-hospital-owner.component';
import { ManageGeneralManagersComponent } from './components/ADMIN/manage-general-managers/manage-general-managers.component';
import { ManageDepartmentsComponent } from './components/ADMIN/manage-departments/manage-departments.component';
import { ManageDepartmentManagersComponent } from './components/ADMIN/manage-department-managers/manage-department-managers.component';
import { ManageDoctorsComponent } from './components/ADMIN/manage-doctors/manage-doctors.component';
import { ManageSpecialitiesComponent } from './components/ADMIN/manage-specialities/manage-specialities.component';
import { AdminProfileComponent } from './components/ADMIN/admin-profile/admin-profile.component';

import { ManageHospitalManagerComponent } from './components/HOSPITAL_OWNER/manage-hospital-manager/manage-hospital-manager.component';
import { ManageHospitalDepartmentsComponent } from './components/HOSPITAL_OWNER/manage-hospital-departments/manage-hospital-departments.component';
import { ManageHospitalDepartmentManagerComponent } from './components/HOSPITAL_OWNER/manage-hospital-department-manager/manage-hospital-department-manager.component';
import { ManageDepartmentDoctorsComponent } from './components/HOSPITAL_OWNER/manage-department-doctors/manage-department-doctors.component';
import { HospitalOwnerProfileComponent } from './components/HOSPITAL_OWNER/hospital-owner-profile/hospital-owner-profile.component';

import { SelectHospitalComponent } from './components/GENERAL_MANAGER/select-hospital/select-hospital.component';
import { ManageDepartmentGMComponent } from './components/GENERAL_MANAGER/manage-department-gm/manage-department-gm.component';
import { ManageDepartmentMangerGmComponent } from './components/GENERAL_MANAGER/manage-department-manger-gm/manage-department-manger-gm.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { GeneralManagerProfileComponent } from './components/GENERAL_MANAGER/general-manager-profile/general-manager-profile.component';
import { HospitalIdGuard } from './auth/HospitalId.guard';

import { DepartmentManagerProfileComponent } from './components/DEPARTMENT_MANAGER/department-manager-profile/department-manager-profile.component';
import { DoctorProfileComponent } from './components/DOCTOR/doctor-profile/doctor-profile.component';
import { ManageDoctorsDmComponent } from './components/DEPARTMENT_MANAGER/manage-doctors-dm/manage-doctors-dm.component';
import { GenerateScheduleComponent } from './components/DEPARTMENT_MANAGER/manage-schedule/generate-schedule/generate-schedule.component';
import { ScheduleOptionsComponent } from './components/DEPARTMENT_MANAGER/manage-schedule/schedule-options/schedule-options.component';
import { ScheduleComponent } from './components/DEPARTMENT_MANAGER/manage-schedule/schedule/schedule.component';
import { DoctorScheduleComponent } from './components/DOCTOR/doctor-schedule/doctor-schedule.component';

const routes: Route[] = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  {
    path: 'admin',
    component: SidebarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN' },
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: HomepageComponent },
      { path: 'ManageHospitals', component: TemplateComponent },
      { path: 'ManageHospitalOwners', component: ManageHospitalOwnerComponent },
      { path: 'ManageGeneralManagers', component: ManageGeneralManagersComponent },
      { path: 'ManageDepartments', component: ManageDepartmentsComponent },
      { path: 'ManageDepartmentManagers', component: ManageDepartmentManagersComponent },
      { path: 'ManageDoctors', component: ManageDoctorsComponent },
      { path: 'ManageSpecialities', component: ManageSpecialitiesComponent },
      { path: 'EditProfile', component: AdminProfileComponent },
    ]
  },
  
  {
    path: 'hospital-owner',
    component: SidebarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_HOSPITAL_OWNER' },
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: HomepageComponent },
      { path: 'ManageGeneralManager', component: ManageHospitalManagerComponent },
      { path: 'ManageDepartments', component: ManageHospitalDepartmentsComponent },
      { path: 'ManageDepartmentManagers', component: ManageHospitalDepartmentManagerComponent },
      { path: 'ManageDoctors', component: ManageDepartmentDoctorsComponent },
      { path: 'EditProfile', component: HospitalOwnerProfileComponent },
    ]
  }, 
  { 
    path: 'general-manager', 
    component: SelectHospitalComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_GENERAL_MANAGER' },
    children: [
      { path: 'SelectHospital', redirectTo: 'SelectHospital', pathMatch: 'full' },
      { path: 'SelectHospital', component: SelectHospitalComponent},
    ]
  },
  {
    path: 'general-manager',
    component: SidebarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_GENERAL_MANAGER' },
    children: [
      { path: 'Dashboard', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: HomepageComponent, canActivate: [HospitalIdGuard]  },
      { path: 'ManageDepartments', component: ManageDepartmentGMComponent, canActivate: [HospitalIdGuard]  },
      { path: 'ManageDepartmentManagers', component: ManageDepartmentMangerGmComponent, canActivate: [HospitalIdGuard]  },
      { path: 'EditProfile', component: GeneralManagerProfileComponent, canActivate: [HospitalIdGuard]  },
    ]
  },
  {
    path: 'department-manager',
    component: SidebarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_DEPARTMENT_MANAGER' },
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: HomepageComponent },
      { path: 'ManageDoctors', component: ManageDoctorsDmComponent },
      { path: 'GenerateSchedule', component: GenerateScheduleComponent },
      { path: 'ScheduleOptions', component: ScheduleOptionsComponent },
      { path: 'Schedule', component: ScheduleComponent },
      { path: 'EditProfile', component: DepartmentManagerProfileComponent },
    ]
  },
  {
    path: 'doctor',
    component: SidebarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'ROLE_DOCTOR' },
    children: [
      { path: '', redirectTo: 'Schedule', pathMatch: 'full' },
      { path: 'Schedule', component: DoctorScheduleComponent },
      { path: 'EditProfile', component: DoctorProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
