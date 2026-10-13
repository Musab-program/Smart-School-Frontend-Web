export interface StudentAttendance {
  id?: number;
  studentId: number;
  attendanceDate: string; // ISO date string
  status: "حاضر" | "غائب" | "متأخر" | "مستأذن" | string;
  teacherId: number;

  // UI populated helper fields
  studentName?: string;
  gradeName?: string;
  groupName?: string;
  groupId?: number;
  teacherName?: string;
}

export const ATTENDANCE_STATUSES = [
  { value: "حاضر", label: "حاضر", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { value: "غائب", label: "غائب", color: "text-rose-700 bg-rose-50 border-rose-200" },
  { value: "متأخر", label: "متأخر", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "مستأذن", label: "مستأذن", color: "text-blue-700 bg-blue-50 border-blue-200" },
] as const;
