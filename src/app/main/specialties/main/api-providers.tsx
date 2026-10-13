import { getSpecialty, getTeacher } from "@/lib/api";
import { Specialty } from "@/types/specialty";
import { Teacher } from "@/types/teacher";
import { getCachedData, setCachedData, CACHE_KEYS } from "@/lib/data-cache";

export interface SpecialtyAnalyticsResult {
  specialties: Specialty[];
  specialtiesWithTeachers: (Specialty & { teacherCount: number })[];
  totalSpecialties: number;
  activeSpecialties: number; // Specialties that have at least one teacher
  inactiveSpecialties: number; // Specialties with 0 teachers
  totalTeachers: number;
  averageTeachersPerSpecialty: string;
}

export async function getSpecialtyAnalytics(): Promise<SpecialtyAnalyticsResult> {
  // We can reuse the teacher analytics cache key because the logic is very similar,
  // but let's create a dedicated cache key just for specialty analytics to be safe.
  const SPECIALTY_ANALYTICS_CACHE_KEY = "specialty_analytics_page";
  
  const cached = getCachedData<SpecialtyAnalyticsResult>(SPECIALTY_ANALYTICS_CACHE_KEY);
  if (cached) return cached;

  try {
    const specialties: Specialty[] = await getSpecialty();
    const teachers: Teacher[] = await getTeacher();
    
    const specialtiesWithTeachers = specialties.map(specialty => ({
      ...specialty,
      teacherCount: teachers.filter(t => t.specialtyId === specialty.id).length
    }));

    const totalSpecialties = specialties.length;
    const totalTeachers = teachers.length;
    
    // Active Specialties = Have at least one teacher
    const activeSpecialties = specialtiesWithTeachers.filter(s => s.teacherCount > 0).length;
    const inactiveSpecialties = specialtiesWithTeachers.filter(s => s.teacherCount === 0).length;
    
    const result: SpecialtyAnalyticsResult = {
      specialties,
      totalSpecialties,
      specialtiesWithTeachers,
      totalTeachers,
      activeSpecialties,
      inactiveSpecialties,
      averageTeachersPerSpecialty: totalSpecialties > 0 ? (totalTeachers / totalSpecialties).toFixed(1) : "0"
    };

    setCachedData(SPECIALTY_ANALYTICS_CACHE_KEY, result);
    return result;
  } catch (error) {
    console.error("خطأ في جلب بيانات التخصصات:", error);
    throw new Error("فشل في جلب بيانات التخصصات");
  }
}