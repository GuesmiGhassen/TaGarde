import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HospitalDepartmentService } from '../../../service/HOSPITAL_OWNER/hospital-department.service';
import { DataState } from './manage-hospital-departments.state';
import { DataEvent, DataEventPayload } from './manage-hospital-departments.event';
import { AuthService } from '../../../auth/auth.service';
import { DepartmentDTO } from '../../../models/auth.model';
@Injectable({
  providedIn: 'root'
})
export class ManageHospitalDepartmentsBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    HospitalDepartments: [],
    selectedHospitalDepartments: [],
    HospitalDepartmentDialog: false,
    dialogHeader: '',
    submitted: false,
    selectedDepartments: []
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private departmentService: HospitalDepartmentService, private auth: AuthService) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent, payload?: DataEventPayload) {
    switch (event) {
      case DataEvent.LoadHospitalDepartments:
        this.loadHospitalDepartments();
        break;
      case DataEvent.DeleteHospitalDepartment:
        if (payload?.departmentId) {
          this.deleteHospitalDepartment(payload.departmentId);
        }
        break;
      case DataEvent.SaveHospitalDepartment:
        if (payload?.selectedDepartments) {
          this.saveHospitalDepartment(payload.selectedDepartments);
        }
        break;
      case DataEvent.OpenNewHospitalDepartmentDialog:
        this.openNewHospitalDepartmentDialog();
        break;
      case DataEvent.HideHospitalDepartmentDialog:
        this.hideHospitalDepartmentDialog();
        break;
      case DataEvent.DeleteSelectedHospitalDepartments:
        if (payload?.selectedIds) {
          this.deleteSelectedHospitalDepartments(payload.selectedIds);
        }
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
      console.log(HospitalId)
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

  deleteHospitalDepartment(id: string) {
    this.departmentService.delete(id).subscribe(
      () => this.reloadHospitalDepartments(),
      error => console.error('Error deleting department:', error)
    );
  }

  deleteSelectedHospitalDepartments(ids: string[]) {
    this.departmentService.deleteMultiple(ids).subscribe(
      () => this.reloadHospitalDepartments(),
      error => console.error('Error deleting selected departments:', error)
    );
  }
  private reloadHospitalDepartments() {
    const HospitalId = this.auth.getCurrentUser()?.hospitalId || '';
    this.departmentService.getHospitalById(HospitalId).subscribe(
      data => {
        sessionStorage.setItem('HospitalDetails', JSON.stringify(data.data))
        const updatedHospitalDepartments = data.data.hospitalDepartments;
        sessionStorage.setItem('HospitalDepartments', JSON.stringify(updatedHospitalDepartments));
        this.updateState({
          HospitalDepartments: updatedHospitalDepartments,
          HospitalDepartmentDialog: false,
          selectedDepartments: []
        });
        window.location.reload();
      },
      error => console.error('Error reloading departments data:', error)
    );
  }

  saveHospitalDepartment(departments: DepartmentDTO[]): void {
    const state = this.stateSubject.getValue();
    state.selectedDepartments = departments;

    if (departments && departments.length > 0) {
      departments.forEach(department => {
        this.departmentService.Add(department.id).subscribe(
          () => {
            this.reloadHospitalDepartments();
          },
          error => {
            console.error('Error updating HospitalDepartment:', error);
          }
        );
      });
    } else {
      console.warn('No departments provided for saving.');
    }
  }

  private openNewHospitalDepartmentDialog() {
    this.updateState({
      HospitalDepartmentDialog: true,
      dialogHeader: 'Add New Departments',
      submitted: false,
      selectedDepartments: []
    });
  }

  private hideHospitalDepartmentDialog() {
    this.updateState({ HospitalDepartmentDialog: false, submitted: false });
  }

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
