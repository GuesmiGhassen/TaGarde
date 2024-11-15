import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DoctorService } from '../../../service/ADMIN/doctor.service';
import { DataState } from './manage-doctors.state';
import { DataEvent, DataEventPayload } from './manage-doctors.event';
import { DoctorDTO } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ManageDoctorBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    Doctors: [],
    selectedDoctors: [],
    DoctorDialog: false,
    dialogHeader: '',
    submitted: false,
    editingDoctor: null,
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private doctorService: DoctorService) {
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
          this.disableDoctor(payload.doctorId);
        }
        break;
      case DataEvent.EnableDoctor:
        if (payload?.doctorId) {
          this.enableDoctor(payload.doctorId);
        }
        break;
      case DataEvent.SaveDoctor:
        if (payload?.doctor){
          this.saveDoctor(payload.doctor);
        }
        break;
      case DataEvent.OpenNewDoctorDialog:
        this.openNewDoctorDialog();
        break;
      case DataEvent.HideDoctorDialog:
        this.hideDoctorDialog();
        break;
      case DataEvent.DisableSelectedDoctors:
        if (payload?.selectedIds) {
          this.disableSelectedDoctors(payload.selectedIds);
        }
        break;
    }
  }

  private loadDoctors() {
    const storedData = this.doctorService.getData();

    if (storedData) {
      this.updateState({ Doctors: storedData });
    } else {
      this.doctorService.get().pipe(
        tap(response => this.doctorService.handleApiResponse(response)),
        tap(() => {
          const data = this.doctorService.getData();
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

  enableDoctor(id: string) {
    this.doctorService.enable(id).subscribe(
      () => this.reloadDoctors(),
      error => console.error('Error enabling Doctor:', error)
    );
  }
  disableDoctor(id: string) {
    this.doctorService.disable(id).subscribe(
      () => this.reloadDoctors(),
      error => console.error('Error disabling Doctor:', error)
    );
  }

  disableSelectedDoctors(ids: string[]) {
    this.doctorService.disableMultiple(ids).subscribe(
      () => this.reloadDoctors(),
      error => console.error('Error disabling selected Doctors:', error)
    );
  }

  private reloadDoctors() {
    this.doctorService.get().subscribe(
      data => {
        const updatedDoctors = this.doctorService.filterData(data.data);
        sessionStorage.setItem('doctorsData', JSON.stringify(updatedDoctors));
        this.updateState({
          Doctors: updatedDoctors,
          DoctorDialog: false,
          editingDoctor: null
        });
        window.location.reload();
      },
      error => console.error('Error reloading Doctors data:', error)
    );
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
      } else {
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

  private hideDoctorDialog() {
    this.updateState({ DoctorDialog: false, submitted: false });
  }

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
