export interface Subject {
  id?: number;
  name: string;
}

export interface SubjectDetail {
  id?: number;
  isActive: boolean;
  gradeId: number;
  subjectId: number;
  // Enhanced client-side display fields
  subjectName?: string;
  gradeName?: string;
}

export interface TeachingSubject {
  id?: number;
  academicYear: string;
  semster: number;
  subjectDetailId: number;
  teacherId: number;
  // Enhanced client-side display fields
  teacherName?: string;
  subjectName?: string;
  gradeName?: string;
}
