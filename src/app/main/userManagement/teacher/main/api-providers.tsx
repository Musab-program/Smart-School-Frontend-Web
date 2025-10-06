import { getSpecialty, getTeacher } from "@/lib/api";
import { Specialty } from "@/types/specialty";
import { Teacher } from "@/types/teacher";

export async function getTeacherAnalytics() {
  try {
    const teachers: Teacher[] = await getTeacher();
    const specialties: Specialty[] = await getSpecialty();

    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter(t => t.IsActive).length;
    const inactiveTeachers = teachers.filter(t => !t.IsActive).length;
    const totalSpecialties = specialties.length;


    const teachersBySpecialty = specialties.map(specialty => ({
      specialtyId: specialty.SpecialtyId,
      specialtyName: specialty.SpecialtyName,
      teacherCount: teachers.filter(t => t.SpecialtyId === specialty.SpecialtyId).length
    }));

    return {
      teachers,
      specialties,
      totalTeachers,
      activeTeachers,
      inactiveTeachers,
      totalSpecialties,
      teachersBySpecialty,
      // إحصائيات إضافية
      activationRate: totalTeachers > 0 ? (activeTeachers / totalTeachers * 100).toFixed(1) : "0",
      averageTeachersPerSpecialty: totalSpecialties > 0 ? (totalTeachers / totalSpecialties).toFixed(1) : "0"
    };
  } catch (error) {
    console.error("خطأ في جلب بيانات المعلمين:", error);
    throw new Error("فشل في جلب بيانات المعلمين");
  }
}

// دالة مساعدة لجلب معلم واحد بالـ ID
export async function getTeacherById(teacherId: number): Promise<Teacher | null> {
  try {
    const teachers = await getTeacher();
    return teachers.find(teacher => teacher.userId === teacherId) || null;
  } catch (error) {
    console.error("خطأ في جلب بيانات المعلم:", error);
    return null;
  }
}

// دالة مساعدة لجلب المعلمين حسب التخصص
export async function getTeachersBySpecialty(specialtyId: number): Promise<Teacher[]> {
  try {
    const teachers = await getTeacher();
    return teachers.filter(teacher => teacher.SpecialtyId === specialtyId);
  } catch (error) {
    console.error("خطأ في جلب المعلمين حسب التخصص:", error);
    return [];
  }
}

export async function getSpecialtyName  (id: number)  {
  const AllSpecialties =  await getTeacherAnalytics();
  return AllSpecialties.specialties.find(s => s.SpecialtyId === id)?.SpecialtyName || "غير محدد";
};

export async function getQualificationBySpecialtyId  (id: number) {
  const AllSpecialties =  await getTeacherAnalytics();
  return AllSpecialties.specialties.find(s => s.SpecialtyId === id)?.Qualification || "غير متوفر";
};