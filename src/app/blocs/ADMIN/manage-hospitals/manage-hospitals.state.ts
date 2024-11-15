import { HospitalDTO } from "../../../models/auth.model";

export interface DataState {
  Hospitals: HospitalDTO[];
  selectedHospitals: HospitalDTO[];
  HospitalDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  editingHospital: HospitalDTO | null;
}

