import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRole = next.data['expectedRole'];
    const token = this.authService.getToken();
    if (token) {
        return this.authService.validateToken(token).pipe(
        switchMap(() => {
            const userRole = this.authService.getCurrentUserRole();
            if (userRole === expectedRole) {
            return of(true);
            } else {
            this.router.navigate(['/login']);
            return of(false);
            }
        }),
        catchError(() => {
            this.router.navigate(['/login']);
            return of(false);
        })
        );
    }else{
        this.router.navigate(['/login']);
        return of(false);
    }
  }
}
