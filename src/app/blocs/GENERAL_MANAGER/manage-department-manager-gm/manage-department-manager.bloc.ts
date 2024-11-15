import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { DataState } from './manage-department-manager.state';
import { DataEvent, DataEventPayload } from './manage-department-manager.event';
import { AuthService } from '../../../auth/auth.service';
import { HospitalDepartmentManagerGMService } from '../../../service/GENERAL_MANAGER/hospital-department-manager.service';
import { DoctorDTO } from '../../../models/auth.model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ManageDepartmentManagerGMBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    HospitalDepartments: [],
    selectedHospitalDepartmentManagers: [],
    NewAssignDialog: false,
    NewDepartmentManagerDialog: false,
    EditDialog: false,
    editingDepartmentManager: null,
    dialogHeader: '',
    submitted: false,
    selectedDepartments: []
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private auth: AuthService, private departmentManagerService: HospitalDepartmentManagerGMService, private router: Router) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent, payload?: DataEventPayload) {
    switch (event) {
      case DataEvent.LoadHospitalDepartmentManagers:
        this.loadHospitalDepartmentManagers();
        break;
      case DataEvent.DeleteHospitalDepartmentManager:
        if (payload?.departmentManagerId) {
          this.deleteHospitalDepartmentManager(payload.departmentManagerId);
        }
        break;
      case DataEvent.EditHospitalDepartmentManager:
        if (payload?.departmentManagerId) {
          this.editDepartmentManager(payload.departmentManagerId);
        }
        break;
      case DataEvent.SaveHospitalDepartmentManager:
        if (payload?.selectedDepartmentId && payload?.selectedHospitalDepartmentManagerId) {
          this.saveAssignDM(payload.selectedDepartmentId, payload.selectedHospitalDepartmentManagerId);
        }
        break;
      case DataEvent.SaveHospitalDepartmentManager:
        if (payload?.departmentManager) {
          this.saveNewDM(payload.departmentManager);
        }
        break;
      case DataEvent.DisableDepartmentManager:
        if (payload?.departmentManagerId) {
          this.disableDepartmentManager(payload.departmentManagerId);
        }
        break;
      case DataEvent.EnableDepartmentManager:
        if (payload?.departmentManagerId) {
          this.enableDepartmentManager(payload.departmentManagerId);
        }
        break;
      case DataEvent.OpenNewAssignDialog:
        this.openNewAssignDialog();
        break;
      case DataEvent.OpenNewDepartmentManagerDialog:
        this.openNewDepartmentManagerDialog();
        break;
      case DataEvent.HideNewDepartmentManagerDialog:
        this.hideNewDepartmentManagerDialog();
        break;
      case DataEvent.HideNewAssignDialog:
        this.hideNewAssignDialog();
        break;
      case DataEvent.DeleteSelectedHospitalDepartmentManagers:
        if (payload?.selectedIds) {
          this.deleteSelectedHospitalDepartmentManagers(payload.selectedIds);
        }
        break;
    }
  }

  private loadHospitalDepartmentManagers() {
    const storedData = this.departmentManagerService.getData();
    const departments = storedData || [];
    if (departments.length > 0) {
      this.updateState({ HospitalDepartments: departments });
    } else {
      const HospitalIds: string[] = (this.auth.getCurrentUser()?.hospitalIds || []).map(id => id.toString());
      const HospitalId = sessionStorage.getItem("HospitalId");
      if (!HospitalId) {
        this.auth.logout();
        this.router.navigate(['/login']);
      } else if (HospitalId && HospitalIds.includes(HospitalId)) {
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
      } else {
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    }
  }

  deleteHospitalDepartmentManager(id: string) {
    this.departmentManagerService.delete(id).subscribe(
      () => this.reloadHospitalDepartmentManagers(),
      error => console.error('Error deleting department:', error)
    );
  }
  editDepartmentManager(departmentManagerId: string) {
    const departmentManager = this.stateSubject.getValue().HospitalDepartments.find(data => data.departmentManagerDTO?.id);
    if (departmentManager) {
      this.updateState({
        EditDialog: true,
        dialogHeader: 'Edit Department Manager'
      })
    }
  }

  deleteSelectedHospitalDepartmentManagers(ids: string[]) {
    this.departmentManagerService.deleteMultiple(ids).subscribe(
      () => this.reloadHospitalDepartmentManagers(),
      error => console.error('Error deleting selected Department Manager:', error)
    );
  }
  private reloadHospitalDepartmentManagers() {
    const HospitalIds: string[] = (this.auth.getCurrentUser()?.hospitalIds || []).map(id => id.toString());
    const HospitalId = sessionStorage.getItem("HospitalId");
    if (!HospitalId) {
      this.auth.logout();
      this.router.navigate(['/login']);
    } else if (HospitalId && HospitalIds.includes(HospitalId)) {
      this.departmentManagerService.getHospitalById(HospitalId).subscribe(
        data => {
          sessionStorage.setItem('HospitalDetails', JSON.stringify(data.data))
          const updatedHospitalDepartmentManagers = data.data.hospitalDepartments;
          sessionStorage.setItem('HospitalDepartmentManagers', JSON.stringify(updatedHospitalDepartmentManagers));
          this.updateState({
            HospitalDepartments: updatedHospitalDepartmentManagers,
            NewAssignDialog: false,
            selectedDepartments: []
          });
          window.location.reload();
        },
        error => console.error('Error reloading departments data:', error)
      );
    } else {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }
  disableDepartmentManager(id: string) {
    this.departmentManagerService.disable(id).subscribe(
      () => this.reloadHospitalDepartmentManagers(),
      error => console.error('Error disabling Department Manager:', error)
    );
  }
  enableDepartmentManager(id: string) {
    this.departmentManagerService.enable(id).subscribe(
      () => this.reloadHospitalDepartmentManagers(),
      error => console.error('Error enabling Department Manager:', error)
    );
  }
  saveNewDM(departmentManager: DoctorDTO): void {
    const state = this.stateSubject.getValue();
    state.editingDepartmentManager = departmentManager;
    console.log(departmentManager)
    if (departmentManager) {
      // if (departmentManager.id) {
      //   this.departmentManagerService.update(departmentManager).subscribe(
      //     () => {
      //       this.reloadHospitalDepartmentManagers();
      //       window.location.reload();
      //     },
      //     error => {
      //       console.error('Error updating General Manager:', error);
      //     }
      //   );
      // } else 
      {
        this.departmentManagerService.create(departmentManager, 'ROLE_DOCTOR').subscribe(
          () => {
            this.reloadHospitalDepartmentManagers();
          },
          error => {
            console.error('Error creating new Department Manager:', error);
          }
        );
      }
    }
  }
  saveAssignDM(departmentId: string, hospitalDepartmentManagerId: string): void {
    if (departmentId && hospitalDepartmentManagerId) {
      this.departmentManagerService.AssignDM(departmentId, hospitalDepartmentManagerId).subscribe(
        () => {
          this.reloadHospitalDepartmentManagers();
        }
      );
    } else {
      console.warn('No departments provided for saving.');
    }
  }

  private openNewDepartmentManagerDialog() {
    this.updateState({
      NewDepartmentManagerDialog: true,
      NewAssignDialog: false,
      dialogHeader: 'Add New Department Manager',
      submitted: false,
    });
  }
  private hideNewDepartmentManagerDialog() {
    this.updateState({ NewDepartmentManagerDialog: false, submitted: false });
  }
  private openNewAssignDialog() {
    this.updateState({
      NewAssignDialog: true,
      NewDepartmentManagerDialog: false,
      dialogHeader: 'Assign New Department Manager',
      submitted: false,
      selectedDepartments: []
    });
  }

  private hideNewAssignDialog() {
    this.updateState({ NewAssignDialog: false, submitted: false });
  }

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
