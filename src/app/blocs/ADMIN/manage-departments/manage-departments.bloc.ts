import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DepartmentService } from '../../../service/ADMIN/department.service';
import { DataState } from './manage-departments.state';
import { DataEvent, DataEventPayload } from './manage-departments.event';
import { DepartmentDTO } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ManageDepartmentBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    Departments: [],
    selectedDepartments: [],
    DepartmentDialog: false,
    dialogHeader: '',
    submitted: false,
    editingDepartment: null,
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private departmentService: DepartmentService) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent, payload?: DataEventPayload) {
    switch (event) {
      case DataEvent.LoadDepartments:
        this.loadDepartments();
        break;
      case DataEvent.EditDepartment:
        if (payload?.departmentId) {
          this.editDepartment(payload.departmentId);
        }
        break;
      case DataEvent.DeleteDepartment:
        if (payload?.departmentId) {
          this.deleteHospital(payload.departmentId);
        }
        break;
      case DataEvent.SaveDepartment:
        if (payload?.department){
          this.saveDepartment(payload.department);
        }
        break;
      case DataEvent.OpenNewDepartmentDialog:
        this.openNewDepartmentDialog();
        break;
      case DataEvent.HideDepartmentDialog:
        this.hideDepartmentDialog();
        break;
      case DataEvent.DeleteSelectedDepartments:
        if (payload?.selectedIds) {
          this.deleteSelectedDepartments(payload.selectedIds);
        }
        break;
    }
  }

  private loadDepartments() {
    const storedData = this.departmentService.getData();
    
    if (storedData) {
      this.updateState({ Departments: storedData });
    } else {
      this.departmentService.get().pipe(
        tap(response => this.departmentService.handleApiResponse(response)),
        tap(data => this.updateState({ Departments: data.data })),
        catchError((error) => {
          console.error('Error loading departments:', error);
          this.updateState({ Departments: [] });
          return of({ data: [] });
        })
      ).subscribe();
    }
  }

  editDepartment(departmentId: string) {
    console.log("Editing department:", departmentId);
    const hospital = this.stateSubject.getValue().Departments.find(h => h.id === departmentId);

    if (hospital) {
      console.log("Fetched department for editing:", hospital);
      this.updateState({
        DepartmentDialog: true,
        dialogHeader: 'Edit Hospital',
        editingDepartment: { ...hospital }
      });
    }
  }

  deleteHospital(id: string) {
    this.departmentService.delete(id).subscribe(
      () => this.reloadDepartments(),
      error => console.error('Error deleting department:', error)
    );
  }

  deleteSelectedDepartments(ids: string[]) {
    this.departmentService.deleteMultiple(ids).subscribe(
      () => this.reloadDepartments(),
      error => console.error('Error deleting selected departments:', error)
    );
  }

  private reloadDepartments() {
    this.departmentService.get().subscribe(
      data => {
        const updatedDepartments = data.data;
        sessionStorage.setItem('departmentsData', JSON.stringify(updatedDepartments));
        this.updateState({
          Departments: updatedDepartments,
          DepartmentDialog: false,
          editingDepartment: null
        });
        window.location.reload();
      },
      error => console.error('Error reloading departments data:', error)
    );
  }

  saveDepartment(department: DepartmentDTO) {
    const state = this.stateSubject.getValue();
    state.editingDepartment = department;

    if (department) {
      if (department.id) {
        // Update existing hospital
        this.departmentService.update(department).subscribe(
          () => {
            this.reloadDepartments();
          },
          error => {
            console.error('Error updating Department:', error);
          }
        );
      } else {
        // Create new hospital
        this.departmentService.create(department).subscribe(
          () => {
            this.reloadDepartments();
          },
          error => {
            console.error('Error creating new department:', error);
          }
        );
      }
    }
  }

  private openNewDepartmentDialog() {
    this.updateState({
      DepartmentDialog: true,
      dialogHeader: 'Add New Department',
      submitted: false,
      editingDepartment: {
        id: '',
        name:''
      }
    });
  }

  private hideDepartmentDialog() {
    this.updateState({ DepartmentDialog: false, submitted: false });
  }

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
