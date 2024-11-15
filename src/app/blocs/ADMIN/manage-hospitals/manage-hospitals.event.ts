import { HospitalDTO } from "../../../models/auth.model";

export enum DataEvent {
  LoadHospitals = 'LoadHospitals',
  EditHospital = 'EditHospital',
  DeleteHospital = 'DeleteHospital',
  SaveHospital = 'SaveHospital',
  OpenNewHospitalDialog = 'OpenNewHospitalDialog',
  HideHospitalDialog = 'HideHospitalDialog',
  DeleteSelectedHospitals = 'DeleteSelectedHospitals',
  UpdateHospital = 'UpdateHospital'
}

export interface DataEventPayload {
  hospitalId?: string;
  selectedIds?: string[];
  hospital?: HospitalDTO;
}