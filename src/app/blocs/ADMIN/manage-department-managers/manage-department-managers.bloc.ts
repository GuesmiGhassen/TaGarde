import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DepartmentManagerService } from '../../../service/ADMIN/department-manager.service';
import { DataState } from './manage-department-managers.state';
import { DataEvent, DataEventPayload } from './manage-department-managers.event';
import { DoctorDTO } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ManageDepartmentManagerBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    DepartmentManagers: [],
    selectedDepartmentManagers: [],
    DepartmentManagerDialog: false,
    dialogHeader: '',
    submitted: false,
    editingDepartmentManager: null,
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private departmentManagerService: DepartmentManagerService) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent, payload?: DataEventPayload) {
    switch (event) {
      case DataEvent.LoadDepartmentManagers:
        this.loadDepartmentManagers();
        break;
      case DataEvent.EditDepartmentManager:
        if (payload?.departmentManagerId) {
          this.editDepartmentManager(payload.departmentManagerId);
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
      case DataEvent.SaveDepartmentManager:
        if (payload?.departmentManager) {
          this.saveDepartmentManager(payload.departmentManager);
        }
        break;
      case DataEvent.OpenNewDepartmentManagerDialog:
        this.openNewDepartmentManagerDialog();
        break;
      case DataEvent.HideDepartmentManagerDialog:
        this.hideDepartmentManagerDialog();
        break;
      case DataEvent.DisableSelectedDepartmentManagers:
        if (payload?.selectedIds) {
          this.disableSelectedDepartmentManagers(payload.selectedIds);
        }
        break;
    }
  }

  private loadDepartmentManagers() {
    const storedData = this.departmentManagerService.getData();

    if (storedData) {
      this.updateState({ DepartmentManagers: storedData });
    } else {
      this.departmentManagerService.get().pipe(
        tap(response => this.departmentManagerService.handleApiResponse(response)),
        tap(() => {
          const data = this.departmentManagerService.getData();
          this.updateState({ DepartmentManagers: data || [] });
        }),
        catchError((error) => {
          console.error('Error loading Department Managers:', error);
          this.updateState({ DepartmentManagers: [] });
          return of({ data: [] });
        })
      ).subscribe();
    }
  }

  editDepartmentManager(departmentManagerId: string) {
    console.log("Editing Department Manager:", departmentManagerId);
    const departmentManager = this.stateSubject.getValue().DepartmentManagers.find(dm => dm.id === departmentManagerId);

    if (departmentManager) {
      console.log("Fetched Department Manager for editing:", departmentManager);
      this.updateState({
        DepartmentManagerDialog: true,
        dialogHeader: 'Edit Department Manager',
        editingDepartmentManager: { ...departmentManager }
      });
    }
  }

  enableDepartmentManager(id: string) {
    this.departmentManagerService.enable(id).subscribe(
      () => this.reloadDepartmentManagers(),
      error => console.error('Error enabling Department Manager:', error)
    );
  }
  disableDepartmentManager(id: string) {
    this.departmentManagerService.disable(id).subscribe(
      () => this.reloadDepartmentManagers(),
      error => console.error('Error disabling Department Manager:', error)
    );
  }

  disableSelectedDepartmentManagers(ids: string[]) {
    this.departmentManagerService.disableMultiple(ids).subscribe(
      () => this.reloadDepartmentManagers(),
      error => console.error('Error disabling selected Department Managers:', error)
    );
  }

  private reloadDepartmentManagers() {
    this.departmentManagerService.get().subscribe(
      data => {
        const updatedDepartmentManagers = this.departmentManagerService.filterData(data.data);
        sessionStorage.setItem('departmentManagersData', JSON.stringify(updatedDepartmentManagers));
        this.updateState({
          DepartmentManagers: updatedDepartmentManagers,
          DepartmentManagerDialog: false,
          editingDepartmentManager: null
        });
        window.location.reload();
      },
      error => console.error('Error reloading Department Managers data:', error)
    );
  }

  saveDepartmentManager(departmentManager: DoctorDTO) {
    const state = this.stateSubject.getValue();
    state.editingDepartmentManager = departmentManager;

    if (departmentManager) {
      if (departmentManager.id) {
        this.departmentManagerService.update(departmentManager).subscribe(
          () => {
            this.reloadDepartmentManagers();
          },
          error => {
            console.error('Error updating Department Manager:', error);
          }
        );
      } else {
        this.departmentManagerService.create(departmentManager, 'ROLE_DEPARTMENT_MANAGER').subscribe(
          () => {
            this.reloadDepartmentManagers();
          },
          error => {
            console.error('Error creating new Department Manager:', error);
          }
        );
      }
    }
  }

  private openNewDepartmentManagerDialog() {
    this.updateState({
      DepartmentManagerDialog: true,
      dialogHeader: 'Add New Department Manager',
      submitted: false,
      editingDepartmentManager: {
        id: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        email: '',
        dateOfBirth: '',
        codeCNOM: '',
        codeCNAM: '',
        specialityId: '',
        hospitalDepartmentToManageId: ''
      }
    });
  }

  private hideDepartmentManagerDialog() {
    this.updateState({ DepartmentManagerDialog: false, submitted: false });
  }

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
