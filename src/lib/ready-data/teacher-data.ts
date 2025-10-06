import { getSpecialty, getTeacher } from "@/lib/api";
import { Specialty } from "@/types/specialty";
import { Teacher } from "@/types/teacher";


export async function getTeacherData() {
    const teachers: Teacher[] = await getTeacher();
    const specialties: Specialty[] = await getSpecialty();

    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter(t => t.IsActive).length;
    const inactiveTeachers = teachers.filter(t => !t.IsActive).length;
    const totalSpecialties = specialties.length;

    // ضمان إرجاع بيانات نظيفة بدون functions
    return JSON.parse(JSON.stringify({
        teachers: teachers.map(teacher => ({
            UserId: teacher.UserId,
            UserName: teacher.UserName,
            Email: teacher.Email,
            RoleID: teacher.RoleID,
            Phone: teacher.Phone,
            Password: teacher.Password,
            DateOfBirth: teacher.DateOfBirth,
            IsActive: teacher.IsActive,
            Address: teacher.Address,
            gender: teacher.gender,
            Id: teacher.Id,
            SpecialtyId: teacher.SpecialtyId,
            Salary: teacher.Salary,
            userId: teacher.userId || teacher.UserId
        })),
        specialties: specialties.map(specialty => ({
            SpecialtyId: specialty.SpecialtyId,
            SpecialtyName: specialty.SpecialtyName,
            Qualification: specialty.Qualification,
            Description: specialty.Description
        })),
        totalTeachers,
        totalSpecialties,
        activeTeachers,
        inactiveTeachers
    }));
}