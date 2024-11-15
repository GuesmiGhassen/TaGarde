import { DoctorDTO } from "../../../models/auth.model";

export interface DataState {
  Doctors: DoctorDTO[];
  selectedDoctors: DoctorDTO[];
  DoctorDialog: boolean;
  AssignDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  editingDoctor: DoctorDTO | null;
}

