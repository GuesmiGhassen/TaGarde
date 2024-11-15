import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralManagerDTO } from '../../models/auth.model';
import { UserApiService } from '../users-api.service';
import { AuthService } from '../../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class GeneralManagerService extends UserApiService<GeneralManagerDTO> {

  constructor( http: HttpClient, authService: AuthService){
    super(http, 'http://localhost:8081/api/v1', 'generalManagersData', 'ROLE_GENERAL_MANAGER', authService);
  }

}
