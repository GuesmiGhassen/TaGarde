import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DoctorDTO } from '../../models/auth.model';
import { UserApiService } from '../users-api.service';
import { AuthService } from '../../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class DoctorService extends UserApiService<DoctorDTO> {

  constructor( http: HttpClient, authService: AuthService){
    super(http, 'http://localhost:8081/api/v1', 'doctorsData', 'ROLE_DOCTOR',authService);
  }

}
