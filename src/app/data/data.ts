export const user = {
  Fname: 'Ghassen',
  Lname: 'G.',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role:'Admin',
};

export const userNavigation = [
  { name: 'Your Profile', href: '/admin/EditProfile' }
];

export const menuItems = {
  ROLE_ADMIN: [
    {
      link: '/admin/Dashboard',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350060/TaGarde/Dashboard_u1az4q.png',
      text: 'Dashboard',
    },
    {
      link: '/admin/ManageHospitals',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Hospital_oxppnr.png',
      text: 'Manage Hospitals',
    },
    {
      link: '/admin/ManageHospitalOwners',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/HO_xlyefk.png',
      text: 'Manage Hospital Owners',
    },
    {
      link: '/admin/ManageGeneralManagers',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/GM_ldhzlz.png',
      text: 'Manage General Managers',
    },
    {
      link: '/admin/ManageDepartments',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Department_bvkps2.png',
      text: 'Manage Departments',
    },
    {
      link: '/admin/ManageDepartmentManagers',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Manager_wcudjt.png',
      text: 'Manage Department Managers',
    },
    {
      link: '/admin/ManageDoctors',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Doctor_m5uvth.png',
      text: 'Manage Doctors',
    },
    {
      link: '/admin/ManageSpecialities',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Doctor_m5uvth.png',
      text: 'Manage Specialities',
    },
  ],
  ROLE_HOSPITAL_OWNER: [
    {
      link: '/hospital-owner/Dashboard',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350060/TaGarde/Dashboard_u1az4q.png',
      text: 'Dashboard',
    },
    {
      link: '/hospital-owner/ManageGeneralManager',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Manager_wcudjt.png',
      text: 'Manage GM',
    },
    {
      link: '/hospital-owner/ManageDepartments',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Department_bvkps2.png',
      text: 'Manage Departments',
    },
    {
      link: '/hospital-owner/ManageDepartmentManagers',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Manager_wcudjt.png',
      text: 'Department Managers',
    },
    {
      link: '/hospital-owner/ManageDoctors',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Doctor_m5uvth.png',
      text: 'Department Doctors',
    },
  ],
  ROLE_GENERAL_MANAGER: [
    {
      link: '/general-manager/Dashboard',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Dashboard_u1az4q.png',
      text: 'Dashboard',
    },
    {
      link: '/general-manager/ManageDepartments',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Department_bvkps2.png',
      text: 'Departments',
    },
    {
      link: '/general-manager/ManageDepartmentManagers',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Manager_wcudjt.png',
      text: 'Departments Manager',
    },
  ],
  ROLE_DEPARTMENT_MANAGER: [
    {
      link: '/department-manager/Dashboard',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Dashboard_u1az4q.png',
      text: 'Dashboard',
    },
    {
      link: '/department-manager/ManageDoctors',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Doctor_m5uvth.png',
      text: 'Doctors',
    },
    {
      link: '/department-manager/Schedule',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Schedule_vla1iz.png',
      text: 'Schedule',
    },
  ],
  ROLE_DOCTOR: [
    {
      link: '/doctor/Schedule',
      icon: 'https://res.cloudinary.com/dvw61yp2y/image/upload/v1720350608/TaGarde/Schedule_vla1iz.png',
      text: 'Schedule',
    },
  ],
};

export const HomePageMenu = [
  {
    link: '/admin/ManageHospitals',
    icon: 'home_health',
    text: 'Create Hospital',
    description: 'You can now create a hospital',
    customStyle: 'bg-[#7A6EFE]',
    iconStyle: 'bg-[#9188FF]',
    role: ['ROLE_ADMIN']
  },
  {
    link: '/admin/ManageHospitalOwners',
    icon: 'person_add',
    text: 'Create Hospital Owners',
    description: 'After creating the hospital now assign the HO',
    customStyle: 'bg-[#FF5363]',
    iconStyle: 'bg-[#FF5F6F]',
    role: ['ROLE_ADMIN']
  },
  {
    link: '/admin/ManageDepartments',
    icon: 'domain',
    text: 'Create Department',
    description: 'You can now create departments and manage them',
    customStyle: 'bg-[#FFA901]',
    iconStyle: 'bg-[#FFB72D]',
    role: ['ROLE_ADMIN']
  },
  {
    link: '/admin/ManageHospitalOwners',
    icon: 'assignment_turned_in',
    text: 'Assign Hospital Owner',
    description: 'You can give access now to anyone',
    customStyle: 'bg-[#24A8FA]',
    iconStyle: 'bg-[#64C5F2]',
    role: ['ROLE_ADMIN']
  },
  {
    link: '/hospital-owner/ManageDepartments',
    icon: 'domain',
    text: 'Add Department',
    description: 'You can give access now to anyone',
    customStyle: 'bg-[#7A6EFE]',
    iconStyle: 'bg-[#9188FF]',
    role: ['ROLE_HOSPITAL_OWNER']
  },
  {
    link: '/hospital-owner/ManageGeneralManager',
    icon: 'person_add',
    text: 'Create General Manager',
    description: 'You can give access now to anyone',
    customStyle: 'bg-[#FF5363]',
    iconStyle: 'bg-[#FF5F6F]',
    role: ['ROLE_HOSPITAL_OWNER']
  },
  {
    link: '/hospital-owner/ManageGeneralManager',
    icon: 'assignment_turned_in',
    text: 'Assign General Manager',
    description: 'You can give access now to anyone',
    customStyle: 'bg-[#FFA901]',
    iconStyle: 'bg-[#FFB72D]',
    role: ['ROLE_HOSPITAL_OWNER']
  },
  {
    link: '/general-manager/ManageDepartmentManagers',
    icon: 'person_add',
    text: 'Create Department Manager',
    description: 'You can assign A DM',
    customStyle: 'bg-[#7A6EFE]',
    iconStyle: 'bg-[#9188FF]',
    role: ['ROLE_GENERAL_MANAGER']
  },
  {
    link: '/general-manager/ManageDepartmentManagers',
    icon: 'assignment_turned_in',
    text: 'Assign Department Manager',
    description: 'You can assign A DM',
    customStyle: 'bg-[#FF5363]',
    iconStyle: 'bg-[#FF5F6F]',
    role: ['ROLE_GENERAL_MANAGER']
  },
  {
    link: '/department-manager/ManageDoctors',
    icon: 'person_add',
    text: 'Add A Doctor',
    description: 'You can assign A DM',
    customStyle: 'bg-[#7A6EFE]',
    iconStyle: 'bg-[#9188FF]',
    role: ['ROLE_DEPARTMENT_MANAGER']
  },
  {
    link: '/department-manager/Schedule',
    icon: 'calendar_clock',
    text: 'Generate Schedule',
    description: 'You can assign A DM',
    customStyle: 'bg-[#FF5363]',
    iconStyle: 'bg-[#FF5F6F]',
    role: ['ROLE_DEPARTMENT_MANAGER']
  },
];