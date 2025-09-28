export interface User {
  UserId: number;
  UserName: string;
  Email: string;
  RoleID: number;
  Phone: string;
  Password?: string; // علامة الاستفهام تعني أن هذا الحقل اختياري
  DateOfBirth: string;
  IsActive: boolean;
  Address: string;
  gender: string;
}