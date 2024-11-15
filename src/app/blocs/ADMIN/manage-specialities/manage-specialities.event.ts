import { specialityDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadSpecialities = 'LoadSpecialities',
    EditSpeciality = 'EditSpeciality',
    DeleteSpeciality = 'DeleteSpeciality',
    SaveSpeciality = 'SaveSpeciality',
    OpenNewSpecialityDialog = 'OpenNewSpecialityDialog',
    HideSpecialityDialog = 'HideSpecialityDialog',
    DeleteSelectedSpecialities = 'DeleteSelectedSpecialities',
    UpdateSpeciality = 'UpdateSpeciality'
  }
  
  export interface DataEventPayload {
    specialityId?: string;
    selectedIds?: string[];
    speciality: specialityDTO;
  }