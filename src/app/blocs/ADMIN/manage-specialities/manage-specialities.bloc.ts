import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { SpecialitiesService } from '../../../service/ADMIN/specialities.service';
import { DataState } from './manage-specialities.state';
import { DataEvent, DataEventPayload } from './manage-specialities.event';
import { specialityDTO } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ManageSpecialityBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    Specialities: [],
    selectedSpecialities: [],
    SpecialityDialog: false,
    dialogHeader: '',
    submitted: false,
    editingSpeciality: null,
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private specialityService: SpecialitiesService) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent, payload?: DataEventPayload) {
    switch (event) {
      case DataEvent.LoadSpecialities:
        this.loadSpecialities();
        break;
      case DataEvent.EditSpeciality:
        if (payload?.specialityId) {
          this.editSpeciality(payload.specialityId);
        }
        break;
      case DataEvent.DeleteSpeciality:
        if (payload?.specialityId) {
          this.deleteHospital(payload.specialityId);
        }
        break;
      case DataEvent.SaveSpeciality:
        if (payload?.speciality){
          this.saveSpeciality(payload.speciality);
        }
        break;
      case DataEvent.OpenNewSpecialityDialog:
        this.openNewSpecialityDialog();
        break;
      case DataEvent.HideSpecialityDialog:
        this.hideSpecialityDialog();
        break;
      case DataEvent.DeleteSelectedSpecialities:
        if (payload?.selectedIds) {
          this.deleteSelectedSpecialities(payload.selectedIds);
        }
        break;
    }
  }

  private loadSpecialities() {
    const storedData = this.specialityService.getData();
    
    if (storedData) {
      this.updateState({ Specialities: storedData });
    } else {
      this.specialityService.get().pipe(
        tap(response => this.specialityService.handleApiResponse(response)),
        tap(data => this.updateState({ Specialities: data.data })),
        catchError((error) => {
          console.error('Error loading specialitys:', error);
          this.updateState({ Specialities: [] });
          return of({ data: [] });
        })
      ).subscribe();
    }
  }

  editSpeciality(specialityId: string) {
    console.log("Editing speciality:", specialityId);
    const hospital = this.stateSubject.getValue().Specialities.find(h => h.id === specialityId);

    if (hospital) {
      console.log("Fetched speciality for editing:", hospital);
      this.updateState({
        SpecialityDialog: true,
        dialogHeader: 'Edit Hospital',
        editingSpeciality: { ...hospital }
      });
    }
  }

  deleteHospital(id: string) {
    this.specialityService.delete(id).subscribe(
      () => this.reloadSpecialities(),
      error => console.error('Error deleting speciality:', error)
    );
  }

  deleteSelectedSpecialities(ids: string[]) {
    this.specialityService.deleteMultiple(ids).subscribe(
      () => this.reloadSpecialities(),
      error => console.error('Error deleting selected specialitys:', error)
    );
  }

  private reloadSpecialities() {
    this.specialityService.get().subscribe(
      data => {
        const updatedSpecialities = data.data;
        sessionStorage.setItem('specialitysData', JSON.stringify(updatedSpecialities));
        this.updateState({
          Specialities: updatedSpecialities,
          SpecialityDialog: false,
          editingSpeciality: null
        });
        window.location.reload();
      },
      error => console.error('Error reloading specialitys data:', error)
    );
  }

  saveSpeciality(speciality: specialityDTO) {
    const state = this.stateSubject.getValue();
    state.editingSpeciality = speciality;

    if (speciality) {
      if (speciality.id) {
        // Update existing hospital
        this.specialityService.update(speciality).subscribe(
          () => {
            this.reloadSpecialities();
          },
          error => {
            console.error('Error updating Speciality:', error);
          }
        );
      } else {
        // Create new hospital
        this.specialityService.create(speciality).subscribe(
          () => {
            this.reloadSpecialities();
          },
          error => {
            console.error('Error creating new speciality:', error);
          }
        );
      }
    }
  }

  private openNewSpecialityDialog() {
    this.updateState({
      SpecialityDialog: true,
      dialogHeader: 'Add New Speciality',
      submitted: false,
      editingSpeciality: {
        id: '',
        specialityName:''
      }
    });
  }

  private hideSpecialityDialog() {
    this.updateState({ SpecialityDialog: false, submitted: false });
  }

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
