export interface Student {
  id?: number | null;
  registerDate: string;
  userId?: number;
  userName: string;
  userEmail: string;
  userPasswordInput?: string;
  userPhone: string;
  userDateOfBirth: string;
  isActiveUser: boolean;
  userAddress: string;
  userGender: string;
  roleId: number;
  guardianId: number;
  groupId: number;
  // Read/join fields optionally returned by backend
  guardianName?: string;
  groupName?: string;
  gradeName?: string;
}

export type StudentUpsertPayload = {
  id?: number;
  userName: string;
  userEmail: string;
  userPasswordInput?: string;
  userPhone: string;
  userDateOfBirth: string;
  isActiveUser: boolean;
  userAddress: string;
  userGender: string;
  roleId: number;
  guardianId: number;
  groupId: number;
  registerDate?: string;
};
