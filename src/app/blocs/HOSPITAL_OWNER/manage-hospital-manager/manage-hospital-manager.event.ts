import { GeneralManagerDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadGeneralManagers = 'LoadGeneralManagers',
    EditGeneralManager = 'EditGeneralManager',
    DisableGeneralManager = 'DeleteGeneralManager',
    EnableGeneralManager = 'EnableGeneralManager',
    SaveGeneralManager = 'SaveGeneralManager',
    saveAssigningGM = 'saveAssigningGM',
    OpenNewGeneralManagerDialog = 'OpenNewGeneralManagerDialog',
    openNewAssignDialog = 'openNewAssignDialog',
    HideGeneralManagerDialog = 'HideGeneralManagerDialog',
    HideAssignDialog = 'HideAssignDialog',
    UpdateGeneralManager = 'UpdateGeneralManager'
  }
  
  export interface DataEventPayload {
    generalManagerId?: string;
    Manager?: GeneralManagerDTO | null;
    generalManager: GeneralManagerDTO;
  }