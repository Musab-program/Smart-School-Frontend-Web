export interface User {
  id?: number | null;
  UserId?: number;
  userName: string;
  email: string;
  roleID: number;
  phone: string;
  password?: string;
  passwordInput?: string;
  dateOfBirth: string;
  isActive: boolean;
  IsActive?: boolean;
  address: string;
  gender: string;
}