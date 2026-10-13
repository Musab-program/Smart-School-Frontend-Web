import { User } from "@/types/user";

export interface Teacher extends User {
  id: number | null;
  specialtyId: number;
  salary: number;
  // Compatibility aliases
  userId?: number;
  SpecialtyId?: number;
  Salary?: number;
  Id?: number | null;
  UserName?: string;
  Email?: string;
  RoleID?: number;
  Phone?: string;
  Password?: string;
  DateOfBirth?: string;
  Address?: string;
}

export interface TeacherCreationPayload {
  userName: string;
  email: string;
  roleID: number;
  phone: string;
  password?: string;
  dateOfBirth: string;
  isActive: boolean;
  address: string;
  gender: 'male' | 'female' | string;
  specialtyId: string | number;
  salary: number | string;
}

export interface TeacherUpdatePayload {
  id: number;
  userName: string;
  gender: 'male' | 'female' | string;
  dateOfBirth: string;
  email: string;
  roleID: number;
  phone: string;
  password?: string;
  isActive: boolean;
  address: string;
  specialtyId: string | number;
  salary: number | string;
}