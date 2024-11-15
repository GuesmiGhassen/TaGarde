import { DepartmentDTO, DoctorDTO, HospitalDepartmentDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadHospitalDepartmentManagers = 'LoadHospitalDepartmentManagers',
    EditHospitalDepartmentManager = 'EditHospitalDepartmentManager',
    DeleteHospitalDepartmentManager = 'DeleteHospitalDepartmentManager',
    SaveHospitalDepartmentManager = 'SaveHospitalDepartmentManager',
    OpenNewAssignDialog = 'OpenNewAssignDialog',
    HideNewAssignDialog = 'HideNewAssignDialog',
    OpenNewDepartmentManagerDialog = 'OpenNewDepartmentManagerDialog',
    HideNewDepartmentManagerDialog = 'HideNewDepartmentManagerDialog',
    DeleteSelectedHospitalDepartmentManagers = 'DeleteSelectedHospitalDepartmentManagers',
    UpdateHospitalDepartmentManager = 'UpdateHospitalDepartmentManager',
    EnableDepartmentManager = 'EnableHospitalDepartmentManager',
    DisableDepartmentManager = 'DisableHospitalDepartmentManager'
  }
  
  export interface DataEventPayload {
    departmentManagerId?: string;
    selectedIds?: string[];
    selectedDepartmentId?: string;
    selectedHospitalDepartmentManagerId?: string;
    departmentManager: DoctorDTO
  }