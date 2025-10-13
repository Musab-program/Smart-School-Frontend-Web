import { User } from "@/types/user";

export interface Teacher extends User {
    id: number | null; // null يعني أن القيمة يمكن أن تكون فارغة
    specialtyId: number;
    salary: number;
  }

  export interface TeacherCreationPayload {

    userName: string;
    email:string;
    roleID: number;
    phone: string;
    password?: string;
    dateOfBirth: string; 
    isActive: boolean;
    address: string;
    gender: 'male' | 'female' | string;
    specialtyId: string; 
    salary: number | string;

  }



  export interface TeacherUpdatePayload{
    id:number;
    userName: string;
    gender: 'male' | 'female' | string;
    dateOfBirth: string; 
    email: string;
    roleID: number;
    phone: string;
    password?: string;
    isActive: boolean;
    address: string;
    specialtyId: string; 
    salary: number | string;
  }

 