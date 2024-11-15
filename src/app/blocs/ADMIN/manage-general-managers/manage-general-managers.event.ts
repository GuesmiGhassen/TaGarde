import { GeneralManagerDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadGeneralManagers = 'LoadGeneralManagers',
    EditGeneralManager = 'EditGeneralManager',
    DisableGeneralManager = 'DisableGeneralManager',
    EnableGeneralManager = 'EnableGeneralManager',
    SaveGeneralManager = 'SaveGeneralManager',
    OpenNewGeneralManagerDialog = 'OpenNewGeneralManagerDialog',
    HideGeneralManagerDialog = 'HideGeneralManagerDialog',
    DisableSelectedGeneralManagers = 'DisableSelectedGeneralManagers',
    UpdateGeneralManager = 'UpdateGeneralManager'
  }
  
  export interface DataEventPayload {
    generalManagerId?: string;
    selectedIds?: string[];
    generalManager: GeneralManagerDTO;
  }