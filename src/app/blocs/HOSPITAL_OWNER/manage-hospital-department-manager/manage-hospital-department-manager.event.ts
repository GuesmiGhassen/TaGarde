import { DepartmentDTO, DoctorDTO, HospitalDepartmentDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadHospitalDepartmentManagers = 'LoadHospitalDepartmentManagers',
  }
  
  export interface DataEventPayload {
    selectedDepartmentId?: string;
    selectedHospitalDepartmentManagerId?: string;
    departmentManager: DoctorDTO
  }