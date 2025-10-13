export interface User {
  UserId: number;
  userName: string;
  email: string;
  roleID: number;
  phone: string;
  password?: string;
  dateOfBirth: string;
  isActive: boolean;
  address: string;
  gender: string;
}