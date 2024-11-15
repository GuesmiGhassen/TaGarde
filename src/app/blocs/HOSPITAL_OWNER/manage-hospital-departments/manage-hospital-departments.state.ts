import { HospitalDepartmentDTO, DepartmentDTO } from "../../../models/auth.model";

export interface DataState {
  HospitalDepartments: HospitalDepartmentDTO[];
  selectedHospitalDepartments: HospitalDepartmentDTO[];
  HospitalDepartmentDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  selectedDepartments: DepartmentDTO[];
}