import { HospitalDepartmentDTO, DepartmentDTO, DoctorDTO } from "../../../models/auth.model";

export interface DataState {
  HospitalDepartments: HospitalDepartmentDTO[];
  selectedHospitalDepartmentManagers: DoctorDTO[];
  NewAssignDialog: boolean;
  NewDepartmentManagerDialog: boolean;
  editingDepartmentManager: DoctorDTO | null;
  EditDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  selectedDepartments: HospitalDepartmentDTO[];
}