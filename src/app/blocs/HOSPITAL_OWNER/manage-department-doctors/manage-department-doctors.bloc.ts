import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HospitalDepartmentService } from '../../../service/HOSPITAL_OWNER/hospital-department.service';
import { DataState } from './manage-department-doctors.state';
import { DataEvent } from './manage-department-doctors.event';
import { AuthService } from '../../../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ManageDepartmentDoctorsBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    HospitalDepartments: []
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private departmentService: HospitalDepartmentService, private auth: AuthService) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent) {
    switch (event) {
      case DataEvent.LoadHospitalDepartments:
        this.loadHospitalDepartments();
        break;
    }
  }

  private loadHospitalDepartments() {
    const storedData = this.departmentService.getData();
    const departments = storedData || [];
    if (departments.length > 0) {
      this.updateState({ HospitalDepartments: departments });
    } else {
      const HospitalId = this.auth.getCurrentUser()?.hospitalId || '';
      this.departmentService.getHospitalById(HospitalId).pipe(
        tap(response => {
          this.departmentService.handleApiResponse(response);
        }),
        tap(() => {
          const updatedData = this.departmentService.getData() || [];
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
