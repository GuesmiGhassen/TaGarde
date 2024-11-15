export interface LogInDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface UserEntityDTO {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  role: UserRole;
  isEnabled: boolean;
  hospitalId?: string;
  hospitalIds?: string[];
  dateOfBirth?: string;
  codeCNOM?: string;
  codeCNAM?: string;
  specialityDTO?: specialityDTO;
  HospitalDepartmentId?: string;
  hospitalDepartmentToManageId?:string;
}

export interface LogInResponseDTO {
  userEntityDTO: UserEntityDTO;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  timestamp: string;
}

export interface HospitalOwnerDTO {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  hospitalId: string;
  isEnabled?: boolean;
  role?: UserRole;
  hospitalName: string;
}

export interface DepartmentDTO {
  id: string;
  name: string;
}

export interface HospitalDTO {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  hospitalDepartments?: HospitalDepartmentDTO[];
  hospitalOwnerId: string;
  generalManagerId: string;
}

export interface HospitalDepartmentDTO {
  id: string;
  hospitalId: string;
  departmentDTO: DepartmentDTO;
  departmentManagerDTO: DoctorDTO | null;
  doctorsDTO: DoctorDTO[];
}

export interface GeneralManagerDTO {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  password?: string;
  hospitalIds: string[];
  hospitalId?: string;
  isEnabled?: boolean;
  role?: UserRole;
  hospitalName: string[];
}
export interface DoctorDTO {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  role?: UserRole;
  isEnabled?: boolean;
  dateOfBirth: string;
  codeCNOM: string;
  codeCNAM: string;
  specialityId: string;
  specialityDTO?: specialityDTO;
  HospitalDepartmentId?: string;
  hospitalDepartmentToManageId?:string;
}
export interface specialityDTO{
  id: string;
  specialityName: string;
}
