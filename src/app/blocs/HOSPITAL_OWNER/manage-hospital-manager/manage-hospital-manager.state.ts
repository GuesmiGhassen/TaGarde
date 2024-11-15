import { GeneralManagerDTO } from "../../../models/auth.model";

export interface DataState {
  GeneralManagers: GeneralManagerDTO[];
  selectedGeneralManager: GeneralManagerDTO | null;
  GeneralManagerDialog: boolean;
  AssignDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  editingGeneralManager: GeneralManagerDTO | null;
}

