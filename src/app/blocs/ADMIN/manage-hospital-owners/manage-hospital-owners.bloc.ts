import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HospitalOwnerService } from '../../../service/ADMIN/hospital-owner.service';
import { DataState } from './manage-hospital-owners.state';
import { DataEvent, DataEventPayload } from './manage-hospital-owners.event';
import { HospitalOwnerDTO } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ManageHospitalOwnerBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    HospitalOwners: [],
    selectedHospitalOwners: [],
    HospitalOwnerDialog: false,
    dialogHeader: '',
    submitted: false,
    editingHospitalOwner: null,
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private hospitalOwnerService: HospitalOwnerService) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent, payload?: DataEventPayload) {
    switch (event) {
      case DataEvent.LoadHospitalOwners:
        this.loadHospitalOwners();
        break;
      case DataEvent.EditHospitalOwner:
        if (payload?.hospitalOwnerId) {
          this.editHospitalOwner(payload.hospitalOwnerId);
        }
        break;
      case DataEvent.DisableHospitalOwner:
        if (payload?.hospitalOwnerId) {
          this.disableHospitalOwner(payload.hospitalOwnerId);
        }
        break;
        case DataEvent.EnableHospitalOwner:
        if (payload?.hospitalOwnerId) {
          this.enableHospitalOwner(payload.hospitalOwnerId);
        }
        break;
      case DataEvent.SaveHospitalOwner:
        if (payload?.HospitalOwner) {
          this.saveHospitalOwner(payload.HospitalOwner);
        }
        break;
      case DataEvent.OpenNewHospitalOwnerDialog:
        this.openNewHospitalOwnerDialog();
        break;
      case DataEvent.HideHospitalOwnerDialog:
        this.hideHospitalOwnerDialog();
        break;
      case DataEvent.DisableSelectedHospitalOwners:
        if (payload?.selectedIds) {
          this.disableSelectedHospitalOwners(payload.selectedIds);
        }
        break;
    }
  }

  private loadHospitalOwners() {
    const storedData = this.hospitalOwnerService.getData();
    
    if (storedData) {
      this.updateState({ HospitalOwners: storedData });
    } else {
      this.hospitalOwnerService.get().pipe(
        tap(response => this.hospitalOwnerService.handleApiResponse(response)),
        tap(() => {
          const data = this.hospitalOwnerService.getData();
          this.updateState({ HospitalOwners: data || [] });
        }),
        catchError((error) => {
          console.error('Error loading hospital Owners:', error);
          this.updateState({ HospitalOwners: [] });
          return of({ data: [] });
        })
      ).subscribe();
    }
  }

  editHospitalOwner(hospitalOwnerId: string) {
    console.log("Editing hospital Owner:", hospitalOwnerId);
    const hospitalOwner = this.stateSubject.getValue().HospitalOwners.find(h => h.id === hospitalOwnerId);

    if (hospitalOwner) {
      console.log("Fetched hospital Owner for editing:", hospitalOwner);
      this.updateState({
        HospitalOwnerDialog: true,
        dialogHeader: 'Edit Hospital',
        editingHospitalOwner: { ...hospitalOwner }
      });
    }
  }
  enableHospitalOwner(id: string) {
    this.hospitalOwnerService.enable(id).subscribe(
      () => this.reloadHospitalOwners(),
      error => console.error('Error enabling hospital Owner:', error)
    );
  }
  disableHospitalOwner(id: string) {
    this.hospitalOwnerService.disable(id).subscribe(
      () => this.reloadHospitalOwners(),
      error => console.error('Error disabling hospital Owner:', error)
    );
  }

  disableSelectedHospitalOwners(ids: string[]) {
    this.hospitalOwnerService.disableMultiple(ids).subscribe(
      () => this.reloadHospitalOwners(),
      error => console.error('Error disabling selected hospital Owners:', error)
    );
  }

  private reloadHospitalOwners() {
    this.hospitalOwnerService.get().subscribe(
      data => {
        const updatedHospitalOwners = this.hospitalOwnerService.filterData(data.data);
        sessionStorage.setItem('hospitalOwnersData', JSON.stringify(updatedHospitalOwners));
        this.updateState({
          HospitalOwners: updatedHospitalOwners,
          HospitalOwnerDialog: false,
          editingHospitalOwner: null
        });
        // window.location.reload();
      },
      error => console.error('Error reloading hospital Owners data:', error)
    );
  }

  saveHospitalOwner(hospitalOwner : HospitalOwnerDTO) {
    const state = this.stateSubject.getValue();
    state.editingHospitalOwner = hospitalOwner;
    
    if (hospitalOwner) {
      if (hospitalOwner.id) {
        this.hospitalOwnerService.update(hospitalOwner).subscribe(
          () => {
            this.reloadHospitalOwners();
          },
          error => {
            console.error('Error updating hospital Owner:', error);
          }
        );
      } else {
        this.hospitalOwnerService.create(hospitalOwner, 'ROLE_HOSPITAL_OWNER').subscribe(
          () => {
            this.reloadHospitalOwners();
          },
          error => {
            console.error('Error creating new hospital Owner:', error);
          }
        );
      }
    }
  }

  private openNewHospitalOwnerDialog() {
    this.updateState({
      HospitalOwnerDialog: true,
      dialogHeader: 'Add New Hospital Owner',
      submitted: false,
      editingHospitalOwner: {
        id: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        email: '',
        hospitalId:'',
        hospitalName:''
      }
    });
  }

  private hideHospitalOwnerDialog() {
    this.updateState({ HospitalOwnerDialog: false, submitted: false });
  }

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
