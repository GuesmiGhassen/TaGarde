import { HospitalOwnerDTO } from "../../../models/auth.model";

export interface DataState {
  HospitalOwners: HospitalOwnerDTO[];
  selectedHospitalOwners: HospitalOwnerDTO[];
  HospitalOwnerDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  editingHospitalOwner: HospitalOwnerDTO | null;
}

