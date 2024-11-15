import { specialityDTO } from "../../../models/auth.model";

export interface DataState {
  Specialities: specialityDTO[];
  selectedSpecialities: specialityDTO[];
  SpecialityDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  editingSpeciality: specialityDTO | null;
}