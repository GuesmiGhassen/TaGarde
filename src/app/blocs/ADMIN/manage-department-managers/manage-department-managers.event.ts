import { DoctorDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadDepartmentManagers = 'LoadDepartmentManagers',
    EditDepartmentManager = 'EditDepartmentManager',
    DisableDepartmentManager = 'DisableDepartmentManager',
    EnableDepartmentManager = 'EnableDepartmentManager',
    SaveDepartmentManager = 'SaveDepartmentManager',
    OpenNewDepartmentManagerDialog = 'OpenNewDepartmentManagerDialog',
    HideDepartmentManagerDialog = 'HideDepartmentManagerDialog',
    DisableSelectedDepartmentManagers = 'DisableSelectedDepartmentManagers',
    UpdateDepartmentManager = 'UpdateDepartmentManager'
  }
  
  export interface DataEventPayload {
    departmentManagerId?: string;
    selectedIds?: string[];
    departmentManager: DoctorDTO;
  }