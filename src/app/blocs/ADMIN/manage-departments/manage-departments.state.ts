import { DepartmentDTO } from "../../../models/auth.model";

export interface DataState {
  Departments: DepartmentDTO[];
  selectedDepartments: DepartmentDTO[];
  DepartmentDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  editingDepartment: DepartmentDTO | null;
}