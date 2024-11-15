import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DataState } from './manage-hospital-department-manager.state';
import { DataEvent } from './manage-hospital-department-manager.event';
import { AuthService } from '../../../auth/auth.service';
import { HospitalDepartmentManagerService } from '../../../service/HOSPITAL_OWNER/hospital-department-manager.service';
@Injectable({
  providedIn: 'root'
})
export class ManageHospitalDepartmentManagersBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    HospitalDepartments: []
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private auth: AuthService, private departmentManagerService: HospitalDepartmentManagerService) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent) {
    switch (event) {
      case DataEvent.LoadHospitalDepartmentManagers:
        this.loadHospitalDepartmentManagers();
        break;
    }
  }

  private loadHospitalDepartmentManagers() {
    const storedData = this.departmentManagerService.getData();
    const departments = storedData || [];
    if (departments.length > 0) {
      this.updateState({ HospitalDepartments: departments });
    } else {
      const HospitalId = this.auth.getCurrentUser()?.hospitalId || '';
      this.departmentManagerService.getHospitalById(HospitalId).pipe(
        tap(response => {
          this.departmentManagerService.handleApiResponse(response);
        }),
        tap(() => {
          const updatedData = this.departmentManagerService.getData() || [];
          this.updateState({ HospitalDepartments: updatedData });
        }),
        catchError((error) => {
          console.error('Error loading departments:', error);
          this.updateState({ HospitalDepartments: [] });
          return of({ data: [] });
        })
      ).subscribe();
    }
  }
  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
