import { HospitalOwnerDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadHospitalOwners = 'LoadHospitalOwners',
    EditHospitalOwner = 'EditHospitalOwner',
    DisableHospitalOwner = 'DisableHospitalOwner',
    EnableHospitalOwner = 'EnableHospitalOwner',
    SaveHospitalOwner = 'SaveHospitalOwner',
    OpenNewHospitalOwnerDialog = 'OpenNewHospitalOwnerDialog',
    HideHospitalOwnerDialog = 'HideHospitalOwnerDialog',
    DisableSelectedHospitalOwners = 'DisableSelectedHospitalOwners',
    UpdateHospitalOwner = 'UpdateHospitalOwner'
  }
  
  export interface DataEventPayload {
    hospitalOwnerId?: string;
    selectedIds?: string[];
    HospitalOwner: HospitalOwnerDTO;
  }