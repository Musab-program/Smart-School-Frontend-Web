export interface TimeTableEntry {
  id?: number;
  groupId: number;
  subjectDetailId: number;
  teacherId: number;
  dayOfWeek: string;
  startTime: string; // ISO string or time string
  endTime: string;   // ISO string or time string

  // UI populated helper fields
  groupName?: string;
  gradeName?: string;
  gradeId?: number;
  subjectName?: string;
  teacherName?: string;
}

export const DAYS_OF_WEEK = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
] as const;

export type DayOfWeekType = typeof DAYS_OF_WEEK[number];

export interface PeriodSlot {
  periodNumber: number;
  startTime: string; // "08:00"
  endTime: string;   // "08:45"
  label: string;
}
