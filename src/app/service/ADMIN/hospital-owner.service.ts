import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HospitalOwnerDTO } from '../../models/auth.model';
import { UserApiService } from '../users-api.service';
import { AuthService } from '../../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class HospitalOwnerService extends UserApiService<HospitalOwnerDTO> {
  
  constructor( http: HttpClient, authService: AuthService){
    super(http, 'http://localhost:8081/api/v1', 'hospitalOwnersData', 'ROLE_HOSPITAL_OWNER',authService);
  }

}
