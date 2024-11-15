import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HospitalManagerService } from '../../../service/HOSPITAL_OWNER/hospital-manager.servise';
import { DataState } from './manage-hospital-manager.state';
import { DataEvent, DataEventPayload } from './manage-hospital-manager.event';
import { GeneralManagerDTO } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ManageHospitalManagerBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    GeneralManagers: [],
    selectedGeneralManager: null,
    GeneralManagerDialog: false,
    dialogHeader: '',
    submitted: false,
    editingGeneralManager: null,
    AssignDialog: false
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private hospitalManagerService: HospitalManagerService) {
    this.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent(event: DataEvent, payload?: DataEventPayload) {
    switch (event) {
      case DataEvent.LoadGeneralManagers:
        this.loadGeneralManagerOwners();
        break;
      case DataEvent.EditGeneralManager:
        if (payload?.generalManagerId) {
          this.editGeneralManager(payload.generalManagerId);
        }
        break;
      case DataEvent.DisableGeneralManager:
        if (payload?.generalManagerId) {
          this.disableGeneralManager(payload.generalManagerId);
        }
        break;
      case DataEvent.EnableGeneralManager:
        if (payload?.generalManagerId) {
          this.enableGeneralManager(payload.generalManagerId);
        }
        break;
      case DataEvent.SaveGeneralManager:
        if (payload?.generalManager) {
          this.saveGeneralManager(payload.generalManager);
        }
        break;
      case DataEvent.saveAssigningGM:
        if (payload?.Manager) {
          this.saveAssigningGM(payload.Manager);
        }
        break;
      case DataEvent.OpenNewGeneralManagerDialog:
        this.openNewGeneralManagerOwnerDialog();
        break;
      case DataEvent.openNewAssignDialog:
        this.openNewAssignDialog();
        break;
      case DataEvent.HideGeneralManagerDialog:
        this.hideGeneralManagerOwnerDialog();
        break;
      case DataEvent.HideAssignDialog:
        this.hideAssignDialog();
        break;
    }
  }

  private loadGeneralManagerOwners() {
    this.hospitalManagerService.get().pipe(
      tap(response => this.hospitalManagerService.handleApiResponse(response)),
      tap(() => {
        const data = this.hospitalManagerService.getHospitalManagers();
        this.updateState({ GeneralManagers: data || [] });
      }),
      catchError((error) => {
        console.error('Error loading General Managers:', error);
        this.updateState({ GeneralManagers: [] });
        return of({ data: [] });
      })
    ).subscribe();
  }
  editGeneralManager(generalManagerId: string) {
    console.log("Editing General Manager:", generalManagerId);
    const generalManager = this.stateSubject.getValue().GeneralManagers.find(data => data.id === generalManagerId);

    if (generalManager) {
      console.log("Fetched General Manager for editing:", generalManager);
      this.updateState({
        GeneralManagerDialog: true,
        dialogHeader: 'Edit General Manager',
        editingGeneralManager: { ...generalManager }
      });
    }
  }

  disableGeneralManager(id: string) {
    this.hospitalManagerService.disable(id).subscribe(
      () => this.reloadGeneralManagers(),
      error => console.error('Error disabling General Manager:', error)
    );
  }
  enableGeneralManager(id: string) {
    this.hospitalManagerService.enable(id).subscribe(
      () => this.reloadGeneralManagers(),
      error => console.error('Error enabling General Manager:', error)
    );
  }

  private reloadGeneralManagers() {
    this.hospitalManagerService.get().subscribe(
      data => {
        const updatedGeneralManagers = this.hospitalManagerService.filteredDataByRole(data.data);
        const HospitalManagers = this.hospitalManagerService.filteredDataByHospital(data.data);
        sessionStorage.setItem('GeneralManagers', JSON.stringify(updatedGeneralManagers));
        sessionStorage.setItem('HospitalManagers', JSON.stringify(HospitalManagers));
        this.updateState({
          GeneralManagers: HospitalManagers,
          GeneralManagerDialog: false,
          editingGeneralManager: null
        });
        window.location.reload();
      },
      error => console.error('Error reloading General Managers data:', error)
    );
  }
  saveAssigningGM(generalManagers: GeneralManagerDTO) {
    const state = this.stateSubject.getValue();
    const selectedGeneralManager = generalManagers;
    console.log('Second', selectedGeneralManager)
    if (generalManagers) {
      this.hospitalManagerService.AssignGeneralManager(selectedGeneralManager.id).subscribe(
        () => {
          this.reloadGeneralManagers();
        },
      );
    } else {
      console.warn('No departments provided for saving.');
    }
  }
  saveGeneralManager(generalManager: GeneralManagerDTO) {
    const state = this.stateSubject.getValue();
    state.editingGeneralManager = generalManager;

    if (generalManager) {
      if (generalManager.id) {
        this.hospitalManagerService.update(generalManager).subscribe(
          () => {
            this.reloadGeneralManagers();
            window.location.reload();
          },
          error => {
            console.error('Error updating General Manager:', error);
          }
        );
      } else {
        this.hospitalManagerService.create(generalManager, 'ROLE_GENERAL_MANAGER').subscribe(
          () => {
            this.reloadGeneralManagers();
          },
          error => {
            console.error('Error creating new General Manager:', error);
          }
        );
      }
    }
  }

  private openNewAssignDialog() {
    this.updateState({
      AssignDialog: true,
      GeneralManagerDialog: false,
      dialogHeader: 'Assign New General Manager',
      submitted: false
    });
  }
  private openNewGeneralManagerOwnerDialog() {
    this.updateState({
      GeneralManagerDialog: true,
      dialogHeader: 'Add New General Manager',
      submitted: false,
      AssignDialog: false,
      editingGeneralManager: {
        id: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        password: '',
        email: '',
        hospitalIds: [],
        hospitalName: []
      }
    });
  }

  private hideGeneralManagerOwnerDialog() {
    this.updateState({ GeneralManagerDialog: false, submitted: false });
  }
  private hideAssignDialog() {
    this.updateState({ AssignDialog: false, submitted: false });
  }

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
