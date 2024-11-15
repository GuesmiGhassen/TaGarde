import { DoctorDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadDoctors = 'LoadDoctors',
    EditDoctor = 'EditDoctor',
    DisableDoctor = 'DisableDoctor',
    EnableDoctor = 'EnableDoctor',
    SaveDoctor = 'SaveDoctor',
    OpenNewDoctorDialog = 'OpenNewDoctorDialog',
    HideDoctorDialog = 'HideDoctorDialog',
    DisableSelectedDoctors = 'DisableSelectedDoctors',
    UpdateDoctor = 'UpdateDoctor'
  }
  
  export interface DataEventPayload {
    doctorId?: string;
    selectedIds?: string[];
    doctor?: DoctorDTO;
  }