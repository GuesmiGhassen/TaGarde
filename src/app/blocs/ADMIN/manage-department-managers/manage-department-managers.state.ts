import { DoctorDTO } from "../../../models/auth.model";

export interface DataState {
  DepartmentManagers: DoctorDTO[];
  selectedDepartmentManagers: DoctorDTO[];
  DepartmentManagerDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  editingDepartmentManager: DoctorDTO | null;
}

