import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { GeneralManagerService } from '../../../service/ADMIN/general-manager.service';
import { DataState } from './manage-general-managers.state';
import { DataEvent, DataEventPayload } from './manage-general-managers.event';
import { GeneralManagerDTO } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ManageGeneralManagerBloc {
  private stateSubject = new BehaviorSubject<DataState>({
    GeneralManagers: [],
    selectedGeneralManagers: [],
    GeneralManagerDialog: false,
    dialogHeader: '',
    submitted: false,
    editingGeneralManager: null,
  });

  state$ = this.stateSubject.asObservable();
  eventSubject = new Subject<DataEvent>();
  events$ = this.eventSubject.asObservable();

  constructor(private generalManagerService: GeneralManagerService) {
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
        if (payload?.generalManager){
          this.saveGeneralManager(payload.generalManager);
        }
        break;
      case DataEvent.OpenNewGeneralManagerDialog:
        this.openNewGeneralManagerOwnerDialog();
        break;
      case DataEvent.HideGeneralManagerDialog:
        this.hideGeneralManagerOwnerDialog();
        break;
      case DataEvent.DisableSelectedGeneralManagers:
        if (payload?.selectedIds) {
          this.disableSelectedGeneralManagers(payload.selectedIds);
        }
        break;
    }
  }

  private loadGeneralManagerOwners() {
    const storedData = this.generalManagerService.getData();
    if (storedData) {
      this.updateState({ GeneralManagers: storedData });
    } else {
      this.generalManagerService.get().pipe(
        tap(response => this.generalManagerService.handleApiResponse(response)),
        tap(() => {
          const data = this.generalManagerService.getData();
          this.updateState({ GeneralManagers: data || [] });
        }),
        catchError((error) => {
          console.error('Error loading General Managers:', error);
          this.updateState({ GeneralManagers: [] });
          return of({ data: [] });
        })
      ).subscribe();
    }
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
  enableGeneralManager(id: string) {
    this.generalManagerService.enable(id).subscribe(
      () => this.reloadGeneralManagers(),
      error => console.error('Error enabling General Manager:', error)
    );
  }
  disableGeneralManager(id: string) {
    this.generalManagerService.disable(id).subscribe(
      () => this.reloadGeneralManagers(),
      error => console.error('Error disabling General Manager:', error)
    );
  }

  disableSelectedGeneralManagers(ids: string[]) {
    this.generalManagerService.disableMultiple(ids).subscribe(
      () => this.reloadGeneralManagers(),
      error => console.error('Error disabling selected General Managers:', error)
    );
  }

  private reloadGeneralManagers() {
    this.generalManagerService.get().subscribe(
      data => {
        const updatedGeneralManagers = this.generalManagerService.filterData(data.data);
        sessionStorage.setItem('generalManagersData', JSON.stringify(updatedGeneralManagers));
        this.updateState({
          GeneralManagers: updatedGeneralManagers,
          GeneralManagerDialog: false,
          editingGeneralManager: null
        });
        window.location.reload();
      },
      error => console.error('Error reloading General Managers data:', error)
    );
  }

  saveGeneralManager(generalManager: GeneralManagerDTO) {
    const state = this.stateSubject.getValue();
    state.editingGeneralManager = generalManager;

    if (generalManager) {
      if (generalManager.id) {
        this.generalManagerService.update(generalManager).subscribe(
          () => {
            this.reloadGeneralManagers();
          },
          error => {
            console.error('Error updating General Manager:', error);
          }
        );
      } else {
        this.generalManagerService.create(generalManager, 'ROLE_GENERAL_MANAGER').subscribe(
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

  private openNewGeneralManagerOwnerDialog() {
    this.updateState({
      GeneralManagerDialog: true,
      dialogHeader: 'Add New General Manager',
      submitted: false,
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

  private updateState(newState: Partial<DataState>) {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...newState });
  }
}
