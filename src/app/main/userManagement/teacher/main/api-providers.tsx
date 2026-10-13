import { getSpecialty, getTeacher } from "@/lib/api";
import { Specialty } from "@/types/specialty";
import { Teacher } from "@/types/teacher";
import { getCachedData, setCachedData, CACHE_KEYS } from "@/lib/data-cache";

interface TeacherAnalyticsResult {
  teachers: Teacher[];
  specialties: Specialty[];
  totalTeachers: number;
  activeTeachers: number;
  inactiveTeachers: number;
  totalSpecialties: number;
  teachersBySpecialty: Array<{
    specialtyId: number;
    specialtyName: string;
    teacherCount: number;
  }>;
  activationRate: string;
  averageTeachersPerSpecialty: string;
}

export async function getTeacherAnalytics(): Promise<TeacherAnalyticsResult> {
  // Check cache first
  const cached = getCachedData<TeacherAnalyticsResult>(CACHE_KEYS.TEACHER_ANALYTICS);
  if (cached) return cached;

  try {
    const teachers: Teacher[] = await getTeacher();
    const specialties: Specialty[] = await getSpecialty();

    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter(t => t.isActive).length;
    const inactiveTeachers = teachers.filter(t => !t.isActive).length;
    const totalSpecialties = specialties.length;

    const teachersBySpecialty = specialties.map(specialty => ({
      specialtyId: specialty.id,
      specialtyName: specialty.name,
      teacherCount: teachers.filter(t => t.specialtyId === specialty.id).length
    }));

    const result: TeacherAnalyticsResult = {
      teachers,
      specialties,
      totalTeachers,
      activeTeachers,
      inactiveTeachers,
      totalSpecialties,
      teachersBySpecialty,
      activationRate: totalTeachers > 0 ? (activeTeachers / totalTeachers * 100).toFixed(1) : "0",
      averageTeachersPerSpecialty: totalSpecialties > 0 ? (totalTeachers / totalSpecialties).toFixed(1) : "0"
    };

    // Save to cache
    setCachedData(CACHE_KEYS.TEACHER_ANALYTICS, result);
    return result;
  } catch (error) {
    console.error("خطأ في جلب بيانات المعلمين:", error);
    throw new Error("فشل في جلب بيانات المعلمين");
  }
}

export async function getSpecialtyName(id: number) {
  const AllSpecialties = await getTeacherAnalytics();
  return AllSpecialties.specialties.find(s => s.id === id)?.name || "غير محدد";
}

export async function getQualificationBySpecialtyId(id: number) {
  const AllSpecialties = await getTeacherAnalytics();
  return AllSpecialties.specialties.find(s => s.id === id)?.qualification || "غير متوفر";
}
