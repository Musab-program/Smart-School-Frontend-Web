export interface ExamType {
  id?: number;
  name: string;
  year: string;
}

export interface Exam {
  id?: number;
  subjectDetailId: number;
  examDate: string;
  examTypeId: number;
  limitTime: number; // in minutes
  groupId: number;
  // UI Display Enhancements
  subjectName?: string;
  gradeName?: string;
  groupName?: string;
  examTypeName?: string;
}

export interface ExamResult {
  id?: number;
  subjectDetailId: number;
  studentId: number;
  mark: number;
  rate?: string;
  // UI Display Enhancements
  studentName?: string;
  subjectName?: string;
  gradeName?: string;
}

export interface Assignment {
  id?: number;
  subjectDetailId: number;
  title: string;
  lastDate: string;
  uploadDate?: string;
  // UI Display Enhancements
  subjectName?: string;
  gradeName?: string;
}

export interface SubmittedAssignment {
  id?: number;
  studentId: number;
  assignmentId: number;
  filePath?: string;
  mark?: number;
  notes?: string;
  // UI Display Enhancements
  studentName?: string;
  assignmentTitle?: string;
}
