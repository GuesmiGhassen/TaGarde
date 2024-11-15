import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { DataState } from './manage-department-gm.state';
import { DataEvent, DataEventPayload } from './manage-department-gm.event';
import { AuthService } from '../../../auth/auth.service';
import { DepartmentDTO } from '../../../models/auth.model';
import { HospitalDepartmentGMService } from '../../../service/GENERAL_MANAGER/hospital-department.service';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class ManageDepartmentGMBloc {
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

    constructor(private departmentService: HospitalDepartmentGMService, private auth: AuthService, private router: Router) {
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

    loadHospitalDepartments() {
        const HospitalIds: string[] = (this.auth.getCurrentUser()?.hospitalIds || []).map(id => id.toString());
        const HospitalId = sessionStorage.getItem("HospitalId");
        if (!HospitalId) {
            this.auth.logout();
            this.router.navigate(['/login']);
        } else if (HospitalId && HospitalIds.includes(HospitalId)) {
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
        } else {
            this.auth.logout();
            this.router.navigate(['/login']);
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
