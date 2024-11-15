import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DataState } from './manage-doctors-dm.state';
import { DataEvent, DataEventPayload } from './manage-doctors-dm.event';
import { DoctorDTO } from '../../../models/auth.model';
import { AuthService } from '../../../auth/auth.service';
import { ManageDoctorsDMService } from '../../../service/DEPARTMENT_MANAGER/manage-doctors-dm';

@Injectable({
    providedIn: 'root'
})
export class ManageDoctorsDMBloc {
    private stateSubject = new BehaviorSubject<DataState>({
        Doctors: [],
        selectedDoctors: [],
        DoctorDialog: false,
        dialogHeader: '',
        submitted: false,
        editingDoctor: null,
        AssignDialog: false
    });

    state$ = this.stateSubject.asObservable();
    eventSubject = new Subject<DataEvent>();
    events$ = this.eventSubject.asObservable();

    constructor(private doctorService: ManageDoctorsDMService, private auth: AuthService) {
        this.events$.subscribe(event => this.handleEvent(event));
    }

    private handleEvent(event: DataEvent, payload?: DataEventPayload) {
        switch (event) {
            case DataEvent.LoadDoctors:
                this.loadDoctors();
                break;
            case DataEvent.EditDoctor:
                if (payload?.doctorId) {
                    this.editDoctor(payload.doctorId);
                }
                break;
            case DataEvent.DisableDoctor:
                if (payload?.doctorId) {
                    this.deleteDoctor(payload.doctorId);
                }
                break;
            case DataEvent.SaveDoctor:
                if (payload?.doctor) {
                    this.saveDoctor(payload.doctor);
                }
                break;
            case DataEvent.OpenNewDoctorDialog:
                this.openNewDoctorDialog();
                break;
            case DataEvent.OpenNewAssignDialog:
                this.openNewAssignDialog();
                break;
            case DataEvent.HideDoctorDialog:
                this.hideDoctorDialog();
                break;
            case DataEvent.HideAssignDialog:
                this.hideAssignDialog();
                break;
            case DataEvent.DisableSelectedDoctors:
                if (payload?.selectedIds) {
                    this.deleteSelectedDoctors(payload.selectedIds);
                }
                break;
        }
    }

    private loadDoctors() {
        const storedData = this.doctorService.getDoctors();

        if (storedData) {
            this.updateState({ Doctors: storedData });
        } else {
            const departmentId = this.auth.getCurrentUser()?.hospitalDepartmentToManageId;
            if (departmentId) {
                this.doctorService.LoadDepartmentDetails(departmentId).pipe(
                    tap(response => this.doctorService.handleApiResponse(response)),
                    tap(() => {
                        const data = this.doctorService.getDoctors();
                        this.updateState({ Doctors: data || [] });
                    }),
                    catchError((error) => {
                        console.error('Error loading Doctors:', error);
                        this.updateState({ Doctors: [] });
                        return of({ data: [] });
                    })
                ).subscribe();
            }
        }
    }

    editDoctor(doctorId: string) {
        console.log("Editing Doctor:", doctorId);
        const doctor = this.stateSubject.getValue().Doctors.find(h => h.id === doctorId);

        if (doctor) {
            console.log("Fetched Doctor for editing:", doctor);
            this.updateState({
                DoctorDialog: true,
                dialogHeader: 'Edit Doctor',
                editingDoctor: { ...doctor }
            });
        }
    }

    deleteDoctor(id: string) {
        console.log(id);
        this.doctorService.delete(id).subscribe(
            () => this.reloadDoctors(),
            error => console.error('Error disabling Doctor:', error)
        );
    }

    deleteSelectedDoctors(ids: string[]) {
        this.doctorService.deleteMultiple(ids).subscribe(
            () => this.reloadDoctors(),
            error => console.error('Error disabling selected Doctors:', error)
        );
    }

    private reloadDoctors() {
        const departmentId = this.auth.getCurrentUser()?.hospitalDepartmentToManageId || '';
        this.doctorService.LoadDepartmentDetails(departmentId).subscribe(
            data => {
                sessionStorage.setItem('DepartmentDetails',JSON.stringify(data.data));
                const updateDoctors = data.data.doctorsDTO;
                sessionStorage.setItem('DoctorsDetails',JSON.stringify(updateDoctors));
                this.updateState({
                    Doctors: updateDoctors,
                    DoctorDialog: false,
                    selectedDoctors: []
                });
                window.location.reload();
            },
            error => console.error('Error reloading Doctors data:', error)
        );
    }
    saveAssigningDoctor(doctor : DoctorDTO){
        const state = this.stateSubject.getValue();
        const selectedGeneralManager = doctor;
        console.log('Second', selectedGeneralManager)
        if (doctor) {
          this.doctorService.AssignDoctor(selectedGeneralManager.id).subscribe(
            () => {
              this.reloadDoctors();
            },
          );
        } else {
          console.warn('No departments provided for saving.');
        }
      }
    saveDoctor(doctor: DoctorDTO) {
        const state = this.stateSubject.getValue();
        state.editingDoctor = doctor;

        if (doctor) {
            if (doctor.id) {
                this.doctorService.updateDoctors(doctor,doctor.specialityId).subscribe(
                    () => {
                        this.reloadDoctors();
                    },
                    error => {
                        console.error('Error updating Doctor:', error);
                    }
                );
            } else 
            {
                this.doctorService.create(doctor, 'ROLE_DOCTOR').subscribe(
                    () => {
                        this.reloadDoctors();
                    },
                    error => {
                        console.error('Error creating new Doctor:', error);
                    }
                );
            }
        }
    }

    private openNewDoctorDialog() {
        this.updateState({
            DoctorDialog: true,
            dialogHeader: 'Add New Doctor',
            AssignDialog: false,
            submitted: false,
            editingDoctor: {
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
                HospitalDepartmentId: ''
            }
        });
    }
    private openNewAssignDialog() {
        this.updateState({
            AssignDialog: true,
            DoctorDialog: false,
            dialogHeader: 'Assign New Doctor',
            submitted: false
        });
    }

    private hideDoctorDialog() {
        this.updateState({ DoctorDialog: false, submitted: false });
    }
    private hideAssignDialog() {
        this.updateState({ AssignDialog: false, submitted: false });
    }

    private updateState(newState: Partial<DataState>) {
        const currentState = this.stateSubject.getValue();
        this.stateSubject.next({ ...currentState, ...newState });
    }
}
