import { GeneralManagerDTO } from "../../../models/auth.model";

export interface DataState {
  GeneralManagers: GeneralManagerDTO[];
  selectedGeneralManagers: GeneralManagerDTO[];
  GeneralManagerDialog: boolean;
  dialogHeader: string;
  submitted: boolean;
  editingGeneralManager: GeneralManagerDTO | null;
}

