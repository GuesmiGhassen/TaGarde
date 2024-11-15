import { DepartmentDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadHospitalDepartments = 'LoadHospitalDepartments',
    EditHospitalDepartment = 'EditHospitalDepartment',
    DeleteHospitalDepartment = 'DeleteHospitalDepartment',
    SaveHospitalDepartment = 'SaveHospitalDepartment',
    OpenNewHospitalDepartmentDialog = 'OpenNewHospitalDepartmentDialog',
    HideHospitalDepartmentDialog = 'HideHospitalDepartmentDialog',
    DeleteSelectedHospitalDepartments = 'DeleteSelectedHospitalDepartments',
    UpdateHospitalDepartment = 'UpdateHospitalDepartment'
  }
  
  export interface DataEventPayload {
    departmentId?: string;
    selectedIds?: string[];
    selectedDepartments?: DepartmentDTO[];
  }