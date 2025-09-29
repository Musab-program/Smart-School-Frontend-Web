import { getSpecialty, getTeacher } from "@/lib/api";
import { Specialty } from "@/types/specialty";
import { Teacher } from "@/types/teacher";

  const teachers: Teacher[] = await getTeacher();
  const specialties: Specialty[] = await getSpecialty();

  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.IsActive).length;
  const inactiveTeachers = teachers.filter(t => !t.IsActive).length;
  const totalSpecialties = specialties.length;

  const culomn = teachers.keys