import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HospitalService } from '../../../service/ADMIN/hospital.service';
import { DataState } from './manage-hospitals.state';
import { DataEvent, DataEventPayload } from './manage-hospitals.event';
import { HospitalDTO } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ManageHospitalBloc {
  stateSubject = new BehaviorSubject<DataState>({
    Hospitals: [],
    selectedHospitals: [],
    HospitalDialog: false,
    dialogHeader: '',
    submitted: false,
    editingHospital: null,
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private hospitalService: HospitalService) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent, payload?: DataEventPayload) {
    switch (event) {
      case DataEvent.LoadHospitals:
        this.loadHospitals();
        break;
      case DataEvent.EditHospital:
        if (payload?.hospitalId) {
          this.editHospital(payload.hospitalId);
        }
        break;
      case DataEvent.DeleteHospital:
        if (payload?.hospitalId) {
          this.deleteHospital(payload.hospitalId);
        }
        break;
      case DataEvent.SaveHospital:
        if (payload?.hospital) {
          this.saveHospital(payload.hospital);
        }
        break;
      case DataEvent.OpenNewHospitalDialog:
        this.openNewHospitalOwnerDialog();
        break;
      case DataEvent.HideHospitalDialog:
        this.hideHospitalOwnerDialog();
        break;
      case DataEvent.DeleteSelectedHospitals:
        if (payload?.selectedIds) {
          this.deleteSelectedHospitals(payload.selectedIds);
        }
        break;
    }
  }

  loadHospitals() {
    const storedData = this.hospitalService.getData();
    
    if (storedData) {
      this.updateState({ Hospitals: storedData });
    } else {
      this.hospitalService.get().pipe(
        tap(response => this.hospitalService.handleApiResponse(response)),
        tap(data => this.updateState({ Hospitals: data.data })),
        catchError((error) => {
          console.error('Error loading hospitals:', error);
          this.updateState({ Hospitals: [] });
          return of({ data: [] });
        })
      ).subscribe();
    }
  }
  

  editHospital(hospitalId: string) {
    console.log("Editing hospital:", hospitalId);
    const hospital = this.stateSubject.getValue().Hospitals.find(h => h.id === hospitalId);

    if (hospital) {
      console.log("Fetched hospital for editing:", hospital);
      this.updateState({
        HospitalDialog: true,
        dialogHeader: 'Edit Hospital',
        editingHospital: {...hospital}
      });
    }
  }

  deleteHospital(id: string) {
    this.hospitalService.delete(id).subscribe(
      () => this.reloadHospitals(),
      error => console.error('Error deleting hospital:', error)
    );
  }

  deleteSelectedHospitals(ids: string[]) {
    this.hospitalService.deleteMultiple(ids).subscribe(
      () => this.reloadHospitals(),
      error => console.error('Error deleting selected hospitals:', error)
    );
  }

  private reloadHospitals() {
    this.hospitalService.get().subscribe(
      data => {
        const updatedHospitals = data.data;
        sessionStorage.setItem('hospitalsData', JSON.stringify(updatedHospitals));
        this.updateState({
          Hospitals: updatedHospitals,
          HospitalDialog: false,
          editingHospital: null
        });
        window.location.reload();
      },
      error => console.error('Error reloading hospitals data:', error)
    );
  }

  saveHospital(hospital: HospitalDTO) {
    const state = this.stateSubject.getValue();
    state.editingHospital = hospital;
    if (hospital) {
      if (hospital.id) {
        this.hospitalService.update(hospital).subscribe(
          () => {
            console.log('Loading work!')
            this.reloadHospitals();
          },
          error => {
            console.error('Error updating hospital:', error);
          }
        );
      } else {
        this.hospitalService.create(hospital).subscribe(
          () => {
            this.reloadHospitals();
          },
          error => {
            console.error('Error creating new hospital:', error);
          }
        );
      }
    }
  }

  private openNewHospitalOwnerDialog() {
    this.updateState({
      HospitalDialog: true,
      dialogHeader: 'Add New Hospital',
      submitted: false,
      editingHospital: {
        id: '',
        name: '',
        phone: '',
        address: '',
        email: '',
        hospitalOwnerId: '',
        generalManagerId: ''
      }
    });
  }

  private hideHospitalOwnerDialog() {
    this.updateState({ HospitalDialog: false, submitted: false });
  }

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
