import { DepartmentDTO } from "../../../models/auth.model";

export enum DataEvent {
    LoadDepartments = 'LoadDepartments',
    EditDepartment = 'EditDepartment',
    DeleteDepartment = 'DeleteDepartment',
    SaveDepartment = 'SaveDepartment',
    OpenNewDepartmentDialog = 'OpenNewDepartmentDialog',
    HideDepartmentDialog = 'HideDepartmentDialog',
    DeleteSelectedDepartments = 'DeleteSelectedDepartments',
    UpdateDepartment = 'UpdateDepartment'
  }
  
  export interface DataEventPayload {
    departmentId?: string;
    selectedIds?: string[];
    department: DepartmentDTO;
  }