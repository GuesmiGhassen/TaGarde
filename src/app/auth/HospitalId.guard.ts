import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalIdGuard implements CanActivate {

  constructor(private router: Router, private auth:AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const HospitalIds: string[] = (this.auth.getCurrentUser()?.hospitalIds || []).map(id => id.toString());
    const HospitalId = sessionStorage.getItem("HospitalId");
    if (HospitalId && HospitalIds.includes(HospitalId)) {
      return true; 
    } else {
      this.router.navigate(['general-manager/SelectHospital']); 
      return false;
    }
  }
}
