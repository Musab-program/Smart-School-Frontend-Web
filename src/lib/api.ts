import { Role } from "@/types/role";
import { Specialty } from "@/types/specialty";
import { Teacher, TeacherCreationPayload, TeacherUpdatePayload } from "@/types/teacher";
import { Guardian } from "@/types/guardian";
import { User } from "@/types/user";
import { Grade } from "@/types/grade";
import { Group } from "@/types/group";
import { Student, StudentUpsertPayload } from "@/types/student";
import { Subject, SubjectDetail, TeachingSubject } from "@/types/subject";
import { Exam, ExamType, ExamResult, Assignment, SubmittedAssignment } from "@/types/assessment";
import { TimeTableEntry } from "@/types/timetable";
import { StudentAttendance } from "@/types/attendance";

// Delegate reading mock files to server-only helper when needed
import { readJsonFile } from "@/lib/server-files";
import { authFetch } from "@/lib/auth-client";
import { getCachedData, setCachedData, invalidateCache, CACHE_KEYS } from "@/lib/data-cache";

export const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  process.env.BACKEND_BASE_URL ||
  "https://localhost:44363";

async function fetchData<T>(fileName: string): Promise<T> {
  return readJsonFile<T>(fileName);
}

// ─── Teacher APIs (all require JWT + caching) ───

export async function getTeacher(): Promise<Teacher[]> {
  const cached = getCachedData<Teacher[]>(CACHE_KEYS.TEACHERS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Teachers/GetAllTeacher`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب بيانات المعلمين");
  const data = await res.json();
  const teachers = (data.data || data) as Teacher[];

  setCachedData(CACHE_KEYS.TEACHERS, teachers);
  return teachers;
}

export const getTeachers = getTeacher;

export async function getTeacherById(id: number): Promise<Teacher> {
  const res = await authFetch(`${API_BASE}/api/Teachers/GetTeacherById?id=${id}`);
  if (!res.ok) throw new Error("فشل في جلب بيانات المعلم");
  const data = await res.json();
  return (data.data || data) as Teacher;
}

export async function addTeacher(dataToSend: TeacherCreationPayload): Promise<Teacher> {
  const url = `${API_BASE}/api/Teachers/AddTeacher`;

  const payload = {
    ...dataToSend,
    salary: Number(dataToSend.salary) || 0,
    specialtyId: Number(dataToSend.specialtyId) || 0,
    passwordInput: dataToSend.password || undefined,
  };

  try {
    const response = await authFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body: unknown = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const b = body as Record<string, unknown> | string;
      const msg =
        typeof b === "object" && b !== null
          ? (b.message as string) || (b.title as string) || (b.detail as string) || JSON.stringify(b)
          : (b as string) || `فشل في إضافة المعلم. حالة الاستجابة: ${response.status}`;
      throw new Error(String(msg));
    }

    invalidateCache(CACHE_KEYS.TEACHERS);
    invalidateCache(CACHE_KEYS.TEACHER_ANALYTICS);

    return body as Teacher;
  } catch (error) {
    console.error("فشل الاتصال أو معالجة الاستجابة:", error);
    if (error instanceof Error) throw error;
    throw new Error("حدث خطأ غير متوقع أثناء محاولة الاتصال بالـ API.");
  }
}

export async function updateTeacher(dataToSend: TeacherUpdatePayload): Promise<Teacher> {
  const url = `${API_BASE}/api/Teachers/UpdateTeachers`;

  const payload = {
    ...dataToSend,
    salary: Number(dataToSend.salary) || 0,
    specialtyId: Number(dataToSend.specialtyId) || 0,
    passwordInput: dataToSend.password || undefined,
  };

  const response = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body: unknown = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const b = body as Record<string, unknown> | string;
    const msg =
      typeof b === "object" && b !== null
        ? (b.message as string) || (b.title as string) || (b.detail as string) || JSON.stringify(b)
        : (b as string) || "فشل في تعديل المعلم";
    throw new Error(String(msg));
  }

  invalidateCache(CACHE_KEYS.TEACHERS);
  invalidateCache(CACHE_KEYS.TEACHER_ANALYTICS);

  return body as Teacher;
}

export async function deleteTeacher(id: number): Promise<void> {
  const url = `${API_BASE}/api/Teachers/DeleteTeacher?id=${id}`;

  try {
    const response = await authFetch(url, { method: "DELETE" });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body: unknown = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const b = body as Record<string, unknown> | string;
      const msg =
        typeof b === "object" && b !== null
          ? (b.message as string) || (b.title as string) || (b.detail as string) || JSON.stringify(b)
          : (b as string) || `فشل في حذف المعلم. حالة الاستجابة: ${response.status}`;
      throw new Error(String(msg));
    }

    invalidateCache(CACHE_KEYS.TEACHERS);
    invalidateCache(CACHE_KEYS.TEACHER_ANALYTICS);
  } catch (error) {
    console.error("فشل الاتصال أو معالجة الاستجابة:", error);
    if (error instanceof Error) throw error;
    throw new Error("حدث خطأ غير متوقع أثناء محاولة الاتصال بالـ API.");
  }
}

// ─── Specialty APIs (all require JWT + caching) ───

export async function getSpecialty(): Promise<Specialty[]> {
  const cached = getCachedData<Specialty[]>(CACHE_KEYS.SPECIALTIES);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Specialties/GetAllSpecialty`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب بيانات التخصصات");
  const data = await res.json();
  const specialties = (data.data || data) as Specialty[];

  setCachedData(CACHE_KEYS.SPECIALTIES, specialties);
  return specialties;
}

export const getSpecialties = getSpecialty;

export async function addSpecialty(dataToSend: Omit<Specialty, "id">): Promise<Specialty> {
  const url = `${API_BASE}/api/Specialties/AddSpecialty`;

  try {
    const response = await authFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body: unknown = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const b = body as Record<string, unknown> | string;
      const msg =
        typeof b === "object" && b !== null
          ? (b.message as string) || (b.title as string) || (b.detail as string) || JSON.stringify(b)
          : (b as string) || `فشل في إضافة التخصص`;
      throw new Error(String(msg));
    }

    invalidateCache(CACHE_KEYS.SPECIALTIES);
    invalidateCache(CACHE_KEYS.TEACHER_ANALYTICS);
    invalidateCache(CACHE_KEYS.SPECIALTY_ANALYTICS);
    return body as Specialty;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) throw error;
    throw new Error("حدث خطأ غير متوقع");
  }
}

export async function updateSpecialty(dataToSend: Specialty): Promise<Specialty> {
  const url = `${API_BASE}/api/Specialties/UpdateSpecialty`;

  try {
    const response = await authFetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body: unknown = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const b = body as Record<string, unknown> | string;
      const msg =
        typeof b === "object" && b !== null
          ? (b.message as string) || (b.title as string) || (b.detail as string) || JSON.stringify(b)
          : (b as string) || `فشل في تعديل التخصص`;
      throw new Error(String(msg));
    }

    invalidateCache(CACHE_KEYS.SPECIALTIES);
    invalidateCache(CACHE_KEYS.TEACHER_ANALYTICS);
    invalidateCache(CACHE_KEYS.SPECIALTY_ANALYTICS);
    return body as Specialty;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("حدث خطأ غير متوقع");
  }
}

export async function deleteSpecialty(id: number): Promise<void> {
  const url = `${API_BASE}/api/Specialties/DeleteSpecialty?id=${id}`;

  try {
    const response = await authFetch(url, { method: "DELETE" });
    if (!response.ok) {
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const body: unknown = isJson ? await response.json() : await response.text();
      const b = body as Record<string, unknown> | string;
      const msg =
        typeof b === "object" && b !== null
          ? (b.message as string) || (b.title as string) || (b.detail as string) || JSON.stringify(b)
          : (b as string) || `فشل في حذف التخصص`;
      throw new Error(String(msg));
    }

    invalidateCache(CACHE_KEYS.SPECIALTIES);
    invalidateCache(CACHE_KEYS.TEACHER_ANALYTICS);
    invalidateCache(CACHE_KEYS.SPECIALTY_ANALYTICS);
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("حدث خطأ غير متوقع");
  }
}

// ─── Guardian & RelationTypes APIs ───

export interface GuardianUpsertInput {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  isActive?: string | boolean;
  relation: string | number;
  relationName?: string;
  gender?: string;
  password?: string;
  passwordInput?: string;
  secondryPhone?: string;
  userId?: number | string;
  roleID?: number;
  dateOfBirth?: string;
}

export interface RelationType {
  id: number;
  name: string;
}

export async function getGuardians(): Promise<Guardian[]> {
  const cached = getCachedData<Guardian[]>(CACHE_KEYS.GUARDIANS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Guardian/GetAllGuardians`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب بيانات أولياء الأمور");
  const data = await res.json();
  const guardians = (data.data || data) as Guardian[];

  setCachedData(CACHE_KEYS.GUARDIANS, guardians);
  return guardians;
}

export async function getGuardianById(id: string | number): Promise<any> {
  const res = await authFetch(`${API_BASE}/api/Guardian/GetGuardianById/${id}`);
  if (!res.ok) throw new Error("فشل في جلب بيانات ولي الأمر");
  const data = await res.json();
  return data.data || data;
}

export async function getRelationTypes(): Promise<RelationType[]> {
  const cached = getCachedData<RelationType[]>(CACHE_KEYS.RELATION_TYPES);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/RelationTypes/GetAllRelation`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب صلات القرابة");
  const result = await res.json();
  const relationTypes = (result.data || result) as RelationType[];

  setCachedData(CACHE_KEYS.RELATION_TYPES, relationTypes);
  return relationTypes;
}

export const getRelation = getRelationTypes;

export async function addGuardian(data: GuardianUpsertInput): Promise<any> {
  const url = `${API_BASE}/api/Guardian/AddGuardian`;

  const payload = {
    id: 0,
    relationTypeId: Number(data.relation),
    relationType: {
      id: Number(data.relation),
      name: data.relationName || "",
    },
    userName: data.fullName,
    email: data.email || "",
    phone: data.phone,
    passwordInput: data.passwordInput || data.password || undefined,
    gender: data.gender || "ذكر",
    address: data.address || "",
    secondryPhone: data.secondryPhone || "",
    userId: Number(data.userId) || 0,
    roleID: data.roleID || 3,
    isActive: data.isActive === "true" || data.isActive === true,
    dateOfBirth: data.dateOfBirth || "2000-01-01T00:00:00.000Z",
  };

  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل الإضافة: ${msg}`);
  }

  invalidateCache(CACHE_KEYS.GUARDIANS);
  return await res.json();
}

export async function updateGuardian(
  id: string | number,
  data: GuardianUpsertInput
): Promise<any> {
  const url = `${API_BASE}/api/Guardian/UpdateGuardian`;

  const payload = {
    id: Number(id),
    relationTypeId: Number(data.relation),
    relationType: {
      id: Number(data.relation),
      name: data.relationName || "",
    },
    userName: data.fullName,
    email: data.email || "",
    phone: data.phone,
    passwordInput: data.passwordInput || data.password || undefined,
    gender: data.gender || "ذكر",
    address: data.address || "",
    secondryPhone: data.secondryPhone || "",
    userId: Number(data.userId) || 0,
    roleID: data.roleID || 3,
    isActive: data.isActive === "true" || data.isActive === true,
    dateOfBirth: data.dateOfBirth || "2000-01-01T00:00:00.000Z",
  };

  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل التحديث: ${msg}`);
  }

  invalidateCache(CACHE_KEYS.GUARDIANS);
  return await res.json();
}

export async function deleteGuardian(id: number): Promise<void> {
  const url = `${API_BASE}/api/Guardian/DeleteGuardian?id=${id}`;

  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف ولي الأمر: ${msg}`);
  }

  invalidateCache(CACHE_KEYS.GUARDIANS);
}

// ─── Grade APIs (All require JWT + caching) ───

export async function getGrades(): Promise<Grade[]> {
  const cached = getCachedData<Grade[]>(CACHE_KEYS.GRADES);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Grade/GetAllGrades`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب بيانات الصفوف والمراحل");
  const data = await res.json();
  const grades = (data.data || data) as Grade[];

  setCachedData(CACHE_KEYS.GRADES, grades);
  return grades;
}

export async function getGradeById(id: number): Promise<Grade> {
  const res = await authFetch(`${API_BASE}/api/Grade/GetGradeById/${id}`);
  if (!res.ok) throw new Error("فشل في جلب بيانات الصف");
  const data = await res.json();
  return (data.data || data) as Grade;
}

export async function addGrade(data: Grade): Promise<Grade> {
  const url = `${API_BASE}/api/Grade/AddGrade`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      capacity: Number(data.capacity) || 0,
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إضافة الصف: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.GRADES);
  const json = await res.json();
  return json.data || json;
}

export async function updateGrade(data: Grade): Promise<Grade> {
  const url = `${API_BASE}/api/Grade/UpdateGrade`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      capacity: Number(data.capacity) || 0,
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل الصف: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.GRADES);
  const json = await res.json();
  return json.data || json;
}

export async function deleteGrade(id: number): Promise<void> {
  const url = `${API_BASE}/api/Grade/DeleteGrade?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف الصف: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.GRADES);
}

// ─── Group APIs (All require JWT + caching) ───

export async function getGroups(): Promise<Group[]> {
  const cached = getCachedData<Group[]>(CACHE_KEYS.GROUPS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Group/GetAllGroups`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب بيانات الشعب والمجموعات");
  const data = await res.json();
  const groups = (data.data || data) as Group[];

  setCachedData(CACHE_KEYS.GROUPS, groups);
  return groups;
}

export async function getGroupById(id: number): Promise<Group> {
  const res = await authFetch(`${API_BASE}/api/Group/GetGroupById/${id}`);
  if (!res.ok) throw new Error("فشل في جلب بيانات الشعبة");
  const data = await res.json();
  return (data.data || data) as Group;
}

export async function addGroup(data: Group): Promise<Group> {
  const url = `${API_BASE}/api/Group/AddGroup`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      gradeId: Number(data.gradeId),
      academicYear: data.academicYear || new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إضافة الشعبة: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.GROUPS);
  const json = await res.json();
  return json.data || json;
}

export async function updateGroup(data: Group): Promise<Group> {
  const url = `${API_BASE}/api/Group/UpdateGroup`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      gradeId: Number(data.gradeId),
      academicYear: data.academicYear || new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل الشعبة: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.GROUPS);
  const json = await res.json();
  return json.data || json;
}

export async function deleteGroup(id: number): Promise<void> {
  const url = `${API_BASE}/api/Group/DeleteGroup?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف الشعبة: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.GROUPS);
}

// ─── Student APIs (All require JWT + caching) ───

export async function getStudents(): Promise<Student[]> {
  const cached = getCachedData<Student[]>(CACHE_KEYS.STUDENTS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Students/GetAllStudent`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب بيانات الطلاب");
  const data = await res.json();
  const students = (data.data || data) as Student[];

  setCachedData(CACHE_KEYS.STUDENTS, students);
  return students;
}

export async function getStudentById(id: number): Promise<Student> {
  const res = await authFetch(`${API_BASE}/api/Students/GetStudentById?id=${id}`);
  if (!res.ok) throw new Error("فشل في جلب بيانات الطالب");
  const data = await res.json();
  return (data.data || data) as Student;
}

export async function addStudent(data: StudentUpsertPayload): Promise<Student> {
  const url = `${API_BASE}/api/Students/AddStudent`;
  const payload = {
    id: 0,
    registerDate: data.registerDate || new Date().toISOString(),
    userName: data.userName,
    userEmail: data.userEmail,
    userPasswordInput: data.userPasswordInput || undefined,
    userPhone: data.userPhone,
    userDateOfBirth: data.userDateOfBirth || "2010-01-01T00:00:00.000Z",
    isActiveUser: data.isActiveUser,
    userAddress: data.userAddress || "",
    userGender: data.userGender || "ذكر",
    roleId: Number(data.roleId),
    guardianId: Number(data.guardianId),
    groupId: Number(data.groupId),
  };

  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إضافة الطالب: ${msg}`);
  }

  invalidateCache(CACHE_KEYS.STUDENTS);
  const json = await res.json();
  return (json.data || json) as Student;
}

export async function updateStudent(data: StudentUpsertPayload): Promise<Student> {
  const url = `${API_BASE}/api/Students/UpdateStudents`;
  const payload = {
    id: Number(data.id),
    registerDate: data.registerDate || new Date().toISOString(),
    userName: data.userName,
    userEmail: data.userEmail,
    userPasswordInput: data.userPasswordInput || undefined,
    userPhone: data.userPhone,
    userDateOfBirth: data.userDateOfBirth || "2010-01-01T00:00:00.000Z",
    isActiveUser: data.isActiveUser,
    userAddress: data.userAddress || "",
    userGender: data.userGender || "ذكر",
    roleId: Number(data.roleId),
    guardianId: Number(data.guardianId),
    groupId: Number(data.groupId),
  };

  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل الطالب: ${msg}`);
  }

  invalidateCache(CACHE_KEYS.STUDENTS);
  const json = await res.json();
  return (json.data || json) as Student;
}

export async function deleteStudent(id: number): Promise<void> {
  const url = `${API_BASE}/api/Students/DeleteStudent?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف الطالب: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.STUDENTS);
}

// ─── User APIs (All require JWT + caching) ───

export async function getUsers(): Promise<User[]> {
  const cached = getCachedData<User[]>(CACHE_KEYS.USERS);
  if (cached) return cached;

  try {
    const res = await authFetch(`${API_BASE}/api/Users/GetAllUsers`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const users = (data.data || data) as User[];
      setCachedData(CACHE_KEYS.USERS, users);
      return users;
    }
  } catch {
    // Fallback to local mock file if offline
  }
  return fetchData<User[]>("users.json");
}

export async function getUserById(id: number): Promise<User> {
  const res = await authFetch(`${API_BASE}/api/Users/GetUserById?id=${id}`);
  if (!res.ok) throw new Error("فشل في جلب بيانات المستخدم");
  const data = await res.json();
  return (data.data || data) as User;
}

export async function addUser(data: User): Promise<User> {
  const url = `${API_BASE}/api/Users/AddUser`;
  const payload = {
    ...data,
    roleID: Number(data.roleID),
    passwordInput: data.passwordInput || data.password,
  };
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إضافة المستخدم: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.USERS);
  const json = await res.json();
  return json.data || json;
}

export async function updateUser(data: User): Promise<User> {
  const url = `${API_BASE}/api/Users/UpdateUser`;
  const payload = {
    ...data,
    id: Number(data.id ?? data.UserId),
    roleID: Number(data.roleID),
    passwordInput: data.passwordInput || data.password,
  };
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل المستخدم: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.USERS);
  const json = await res.json();
  return json.data || json;
}

export async function deleteUser(id: number): Promise<void> {
  const url = `${API_BASE}/api/Users/DeleteUser?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف المستخدم: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.USERS);
}

// ─── Role APIs (All require JWT + caching) ───

export async function getRoles(): Promise<Role[]> {
  const cached = getCachedData<Role[]>(CACHE_KEYS.ROLES);
  if (cached) return cached;

  try {
    const res = await authFetch(`${API_BASE}/api/Roles/GetAllRoles`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const roles = (data.data || data) as Role[];
      setCachedData(CACHE_KEYS.ROLES, roles);
      return roles;
    }
  } catch {
    // Fallback to local mock file if offline
  }
  return fetchData<Role[]>("role.json");
}

export async function getRoleById(id: number): Promise<Role> {
  const res = await authFetch(`${API_BASE}/api/Roles/GetByIdRole/${id}`);
  if (!res.ok) throw new Error("فشل في جلب بيانات الدور");
  const data = await res.json();
  return (data.data || data) as Role;
}

export async function addRole(data: Role): Promise<Role> {
  const url = `${API_BASE}/api/Roles/AddRole`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إضافة الدور: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.ROLES);
  const json = await res.json();
  return json.data || json;
}

export async function updateRole(data: Role): Promise<Role> {
  const url = `${API_BASE}/api/Roles/UpdateRole`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل الدور: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.ROLES);
  const json = await res.json();
  return json.data || json;
}

export async function deleteRole(id: number): Promise<void> {
  const url = `${API_BASE}/api/Roles/DeleteRole?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف الدور: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.ROLES);
}

// ─── Guardian backward compatibility alias ───

export async function getGuardian(): Promise<Guardian[]> {
  try {
    return await getGuardians();
  } catch {
    return fetchData<Guardian[]>("guardian.json");
  }
}

// ─── Phase 3: Subjects APIs ───

export async function getSubjects(): Promise<Subject[]> {
  const cached = getCachedData<Subject[]>(CACHE_KEYS.SUBJECTS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Subjects/GetAllSubject`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب بيانات المواد الدراسية");
  const data = await res.json();
  const subjects = (data.data || data) as Subject[];
  setCachedData(CACHE_KEYS.SUBJECTS, subjects);
  return subjects;
}

export async function getSubjectById(id: number): Promise<Subject> {
  const res = await authFetch(`${API_BASE}/api/Subjects/GetSubjectById?id=${id}`);
  if (!res.ok) throw new Error("فشل في جلب بيانات المادة");
  const data = await res.json();
  return (data.data || data) as Subject;
}

export async function addSubject(data: { name: string }): Promise<Subject> {
  const url = `${API_BASE}/api/Subjects/AddSubject`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إضافة المادة الدراسية: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.SUBJECTS);
  const json = await res.json();
  return json.data || json;
}

export async function updateSubject(data: Subject): Promise<Subject> {
  const url = `${API_BASE}/api/Subjects/UpdateSubjects`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل المادة الدراسية: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.SUBJECTS);
  const json = await res.json();
  return json.data || json;
}

export async function deleteSubject(id: number): Promise<void> {
  const url = `${API_BASE}/api/Subjects/DeleteSubject?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف المادة الدراسية: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.SUBJECTS);
}

// ─── Phase 3: Subject Details (Curriculum) APIs ───

export async function getSubjectDetails(): Promise<SubjectDetail[]> {
  const cached = getCachedData<SubjectDetail[]>(CACHE_KEYS.SUBJECT_DETAILS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/SubjectDetails/GetAllSubjectDetail`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب بيانات تفاصيل المنهج الدراسي");
  const data = await res.json();
  const details = (data.data || data) as SubjectDetail[];
  setCachedData(CACHE_KEYS.SUBJECT_DETAILS, details);
  return details;
}

export async function getSubjectDetailById(id: number): Promise<SubjectDetail> {
  const res = await authFetch(`${API_BASE}/api/SubjectDetails/GetSubjectDetailById?id=${id}`);
  if (!res.ok) throw new Error("فشل في جلب تفاصيل المادة");
  const data = await res.json();
  return (data.data || data) as SubjectDetail;
}

export async function addSubjectDetail(data: {
  gradeId: number;
  subjectId: number;
  isActive: boolean;
}): Promise<SubjectDetail> {
  const url = `${API_BASE}/api/SubjectDetails/AddSubjectDetail`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      gradeId: Number(data.gradeId),
      subjectId: Number(data.subjectId),
      isActive: Boolean(data.isActive),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل ربط المادة بالصف الدراسي: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.SUBJECT_DETAILS);
  const json = await res.json();
  return json.data || json;
}

export async function updateSubjectDetail(data: SubjectDetail): Promise<SubjectDetail> {
  const url = `${API_BASE}/api/SubjectDetails/UpdateSubjectDetails`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      id: Number(data.id),
      gradeId: Number(data.gradeId),
      subjectId: Number(data.subjectId),
      isActive: Boolean(data.isActive),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل ارتباط المادة بالصف: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.SUBJECT_DETAILS);
  const json = await res.json();
  return json.data || json;
}

export async function deleteSubjectDetail(id: number): Promise<void> {
  const url = `${API_BASE}/api/SubjectDetails/DeleteSubjectDetail?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف تفصيل المادة: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.SUBJECT_DETAILS);
}

// ─── Phase 3: Teaching Subjects (Teacher Allocation) APIs ───

export async function getTeachingSubjects(): Promise<TeachingSubject[]> {
  const cached = getCachedData<TeachingSubject[]>(CACHE_KEYS.TEACHING_SUBJECTS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/TeachingSubjects/GetAllTeachingSubject`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب بيانات توزيع الحصص والمواد");
  const data = await res.json();
  const list = (data.data || data) as TeachingSubject[];
  setCachedData(CACHE_KEYS.TEACHING_SUBJECTS, list);
  return list;
}

export async function getTeachingSubjectById(id: number): Promise<TeachingSubject> {
  const res = await authFetch(`${API_BASE}/api/TeachingSubjects/GetTeachingSubjectById?id=${id}`);
  if (!res.ok) throw new Error("فشل في جلب بيانات توزيع الحصة");
  const data = await res.json();
  return (data.data || data) as TeachingSubject;
}

export async function addTeachingSubject(data: {
  teacherId: number;
  subjectDetailId: number;
  semster: number;
  academicYear?: string;
}): Promise<TeachingSubject> {
  const url = `${API_BASE}/api/TeachingSubjects/AddTeachingSubject`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      teacherId: Number(data.teacherId),
      subjectDetailId: Number(data.subjectDetailId),
      semster: Number(data.semster) || 1,
      academicYear: data.academicYear || new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إسناد المادة للمعلم: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.TEACHING_SUBJECTS);
  const json = await res.json();
  return json.data || json;
}

export async function updateTeachingSubject(data: TeachingSubject): Promise<TeachingSubject> {
  const url = `${API_BASE}/api/TeachingSubjects/UpdateTeachingSubjects`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      id: Number(data.id),
      teacherId: Number(data.teacherId),
      subjectDetailId: Number(data.subjectDetailId),
      semster: Number(data.semster),
      academicYear: data.academicYear || new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل إسناد المادة: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.TEACHING_SUBJECTS);
  const json = await res.json();
  return json.data || json;
}

export async function deleteTeachingSubject(id: number): Promise<void> {
  const url = `${API_BASE}/api/TeachingSubjects/DeleteTeachingSubject?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إلغاء إسناد المادة: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.TEACHING_SUBJECTS);
}

// ─── Phase 4: Exam Types APIs ───

export async function getExamTypes(): Promise<ExamType[]> {
  const cached = getCachedData<ExamType[]>(CACHE_KEYS.EXAM_TYPES);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/ExamType/GetAllExamTypes`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب أنواع الاختبارات");
  const data = await res.json();
  const types = (data.data || data) as ExamType[];
  setCachedData(CACHE_KEYS.EXAM_TYPES, types);
  return types;
}

export async function addExamType(data: { name: string; year: string }): Promise<ExamType> {
  const url = `${API_BASE}/api/ExamType/AddExamType`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      year: data.year || new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إضافة نوع الاختبار: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.EXAM_TYPES);
  const json = await res.json();
  return json.data || json;
}

export async function updateExamType(data: ExamType): Promise<ExamType> {
  const url = `${API_BASE}/api/ExamType/UpdateExamType`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل نوع الاختبار: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.EXAM_TYPES);
  const json = await res.json();
  return json.data || json;
}

export async function deleteExamType(id: number): Promise<void> {
  const url = `${API_BASE}/api/ExamType/DeleteExamType?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف نوع الاختبار: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.EXAM_TYPES);
}

// ─── Phase 4: Exams APIs ───

export async function getExams(): Promise<Exam[]> {
  const cached = getCachedData<Exam[]>(CACHE_KEYS.EXAMS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Exam/GetAllExams`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب قائمة الاختبارات");
  const data = await res.json();
  const exams = (data.data || data) as Exam[];
  setCachedData(CACHE_KEYS.EXAMS, exams);
  return exams;
}

export async function addExam(data: {
  subjectDetailId: number;
  examDate: string;
  examTypeId: number;
  limitTime: number;
  groupId: number;
}): Promise<Exam> {
  const url = `${API_BASE}/api/Exam/AddExam`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subjectDetailId: Number(data.subjectDetailId),
      examDate: data.examDate,
      examTypeId: Number(data.examTypeId),
      limitTime: Number(data.limitTime),
      groupId: Number(data.groupId),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل جدولة الاختبار: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.EXAMS);
  const json = await res.json();
  return json.data || json;
}

export async function updateExam(data: Exam): Promise<Exam> {
  const url = `${API_BASE}/api/Exam/UpdateExam`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      id: Number(data.id),
      subjectDetailId: Number(data.subjectDetailId),
      examTypeId: Number(data.examTypeId),
      limitTime: Number(data.limitTime),
      groupId: Number(data.groupId),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل الاختبار: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.EXAMS);
  const json = await res.json();
  return json.data || json;
}

export async function deleteExam(id: number): Promise<void> {
  const url = `${API_BASE}/api/Exam/DeleteExam?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف الاختبار: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.EXAMS);
}

// ─── Phase 4: Results (Grades) APIs ───

export async function getResults(): Promise<ExamResult[]> {
  const cached = getCachedData<ExamResult[]>(CACHE_KEYS.RESULTS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Resulte/GetAllResultes`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب نتائج الطلاب");
  const data = await res.json();
  const results = (data.data || data) as ExamResult[];
  setCachedData(CACHE_KEYS.RESULTS, results);
  return results;
}

export async function addResult(data: {
  subjectDetailId: number;
  studentId: number;
  mark: number;
  rate?: string;
}): Promise<ExamResult> {
  const url = `${API_BASE}/api/Resulte/AddResulte`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subjectDetailId: Number(data.subjectDetailId),
      studentId: Number(data.studentId),
      mark: Number(data.mark),
      rate: data.rate || (data.mark >= 90 ? "ممتاز" : data.mark >= 75 ? "جيد جداً" : data.mark >= 50 ? "مقبول" : "راسب"),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل رصد درجة الطالب: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.RESULTS);
  const json = await res.json();
  return json.data || json;
}

export async function updateResult(data: ExamResult): Promise<ExamResult> {
  const url = `${API_BASE}/api/Resulte/UpdateResulte`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      id: Number(data.id),
      subjectDetailId: Number(data.subjectDetailId),
      studentId: Number(data.studentId),
      mark: Number(data.mark),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل الدرجة: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.RESULTS);
  const json = await res.json();
  return json.data || json;
}

export async function deleteResult(id: number): Promise<void> {
  const url = `${API_BASE}/api/Resulte/DeleteResulte?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف النتيجة: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.RESULTS);
}

// ─── Phase 4: Assignments APIs ───

export async function getAssignments(): Promise<Assignment[]> {
  const cached = getCachedData<Assignment[]>(CACHE_KEYS.ASSIGNMENTS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/Assignments/GetAllAssignments`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب الواجبات المدرسية");
  const data = await res.json();
  const assignments = (data.data || data) as Assignment[];
  setCachedData(CACHE_KEYS.ASSIGNMENTS, assignments);
  return assignments;
}

export async function addAssignment(data: {
  title: string;
  subjectDetailId: number;
  lastDate: string;
}): Promise<Assignment> {
  const url = `${API_BASE}/api/Assignments/AddAssignment`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title,
      subjectDetailId: Number(data.subjectDetailId),
      lastDate: data.lastDate,
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إنشاء الواجب المدرسي: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.ASSIGNMENTS);
  const json = await res.json();
  return json.data || json;
}

export async function updateAssignment(data: Assignment): Promise<Assignment> {
  const url = `${API_BASE}/api/Assignments/UpdateAssignment`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      id: Number(data.id),
      subjectDetailId: Number(data.subjectDetailId),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل الواجب: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.ASSIGNMENTS);
  const json = await res.json();
  return json.data || json;
}

export async function deleteAssignment(id: number): Promise<void> {
  const url = `${API_BASE}/api/Assignments/DeleteAssignment/${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف الواجب: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.ASSIGNMENTS);
}

// ─── Phase 4: Submitted Assignments APIs ───

export async function getSubmittedAssignments(): Promise<SubmittedAssignment[]> {
  const cached = getCachedData<SubmittedAssignment[]>(CACHE_KEYS.SUBMITTED_ASSIGNMENTS);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/SubmittedAssignments/GetAllSubmittedAssignment`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب تسليمات الواجبات");
  const data = await res.json();
  const subs = (data.data || data) as SubmittedAssignment[];
  setCachedData(CACHE_KEYS.SUBMITTED_ASSIGNMENTS, subs);
  return subs;
}

export async function addSubmittedAssignment(data: {
  studentId: number;
  assignmentId: number;
  filePath?: string;
  mark?: number;
  notes?: string;
}): Promise<SubmittedAssignment> {
  const url = `${API_BASE}/api/SubmittedAssignments/AddSubmittedAssignment`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentId: Number(data.studentId),
      assignmentId: Number(data.assignmentId),
      filePath: data.filePath || "submission.pdf",
      mark: Number(data.mark) || 0,
      notes: data.notes || "",
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تسجيل تسليم الواجب: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.SUBMITTED_ASSIGNMENTS);
  const json = await res.json();
  return json.data || json;
}

export async function updateSubmittedAssignment(data: SubmittedAssignment): Promise<SubmittedAssignment> {
  const url = `${API_BASE}/api/SubmittedAssignments/UpdateSubmittedAssignments`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      id: Number(data.id),
      studentId: Number(data.studentId),
      assignmentId: Number(data.assignmentId),
      mark: Number(data.mark),
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل تقييم الواجب: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.SUBMITTED_ASSIGNMENTS);
  const json = await res.json();
  return json.data || json;
}

export async function deleteSubmittedAssignment(id: number): Promise<void> {
  const url = `${API_BASE}/api/SubmittedAssignments/DeleteSubmittedAssignment?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف تسليم الواجب: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.SUBMITTED_ASSIGNMENTS);
}

// ─── TimeTable APIs (All require JWT + caching) ───

export async function getTimeTables(): Promise<TimeTableEntry[]> {
  const cached = getCachedData<TimeTableEntry[]>(CACHE_KEYS.TIMETABLES);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/TimeTables/GetAllTimeTable`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب الجدول المدرسي");
  const data = await res.json();
  const list = (data.data || data) as TimeTableEntry[];
  setCachedData(CACHE_KEYS.TIMETABLES, list);
  return list;
}

export async function getTimeTableById(id: number): Promise<TimeTableEntry> {
  const res = await authFetch(`${API_BASE}/api/TimeTables/GetTimeTableById?id=${id}`);
  if (!res.ok) throw new Error("فشل في جلب الحصة الدراسية");
  const data = await res.json();
  return (data.data || data) as TimeTableEntry;
}

export async function addTimeTable(data: {
  groupId: number;
  subjectDetailId: number;
  teacherId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}): Promise<TimeTableEntry> {
  const url = `${API_BASE}/api/TimeTables/AddTimeTable`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: 0,
      groupId: Number(data.groupId),
      subjectDetailId: Number(data.subjectDetailId),
      teacherId: Number(data.teacherId),
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل إضافة الحصة الدراسية: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.TIMETABLES);
  const json = await res.json();
  return json.data || json;
}

export async function updateTimeTable(data: {
  id: number;
  groupId: number;
  subjectDetailId: number;
  teacherId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}): Promise<TimeTableEntry> {
  const url = `${API_BASE}/api/TimeTables/UpdateTimeTables`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: Number(data.id),
      groupId: Number(data.groupId),
      subjectDetailId: Number(data.subjectDetailId),
      teacherId: Number(data.teacherId),
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل الحصة الدراسية: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.TIMETABLES);
  const json = await res.json();
  return json.data || json;
}

export async function deleteTimeTable(id: number): Promise<void> {
  const url = `${API_BASE}/api/TimeTables/DeleteTimeTable?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف الحصة الدراسية: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.TIMETABLES);
}

// ─── Student Attendance APIs (All require JWT + caching) ───

export async function getStudentAttendances(): Promise<StudentAttendance[]> {
  const cached = getCachedData<StudentAttendance[]>(CACHE_KEYS.STUDENT_ATTENDANCE);
  if (cached) return cached;

  const res = await authFetch(`${API_BASE}/api/StudentAttendances/GetAllStudentAttendance`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("فشل في جلب سجلات حضور الطلاب");
  const data = await res.json();
  const list = (data.data || data) as StudentAttendance[];
  setCachedData(CACHE_KEYS.STUDENT_ATTENDANCE, list);
  return list;
}

export async function getStudentAttendanceById(id: number): Promise<StudentAttendance> {
  const res = await authFetch(`${API_BASE}/api/StudentAttendances/GetStudentAttendanceById?id=${id}`);
  if (!res.ok) throw new Error("فشل في جلب سجل الحضور");
  const data = await res.json();
  return (data.data || data) as StudentAttendance;
}

export async function addStudentAttendance(data: {
  studentId: number;
  teacherId: number;
  attendanceDate: string;
  status: string;
}): Promise<StudentAttendance> {
  const url = `${API_BASE}/api/StudentAttendances/AddStudentAttendance`;
  const res = await authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: 0,
      studentId: Number(data.studentId),
      teacherId: Number(data.teacherId),
      attendanceDate: data.attendanceDate,
      status: data.status,
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تسجيل الحضور: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.STUDENT_ATTENDANCE);
  const json = await res.json();
  return json.data || json;
}

export async function updateStudentAttendance(data: {
  id: number;
  studentId: number;
  teacherId: number;
  attendanceDate: string;
  status: string;
}): Promise<StudentAttendance> {
  const url = `${API_BASE}/api/StudentAttendances/UpdateStudentAttendance`;
  const res = await authFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: Number(data.id),
      studentId: Number(data.studentId),
      teacherId: Number(data.teacherId),
      attendanceDate: data.attendanceDate,
      status: data.status,
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل تعديل سجل الحضور: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.STUDENT_ATTENDANCE);
  const json = await res.json();
  return json.data || json;
}

export async function deleteStudentAttendance(id: number): Promise<void> {
  const url = `${API_BASE}/api/StudentAttendances/DeleteStudentAttendance?id=${id}`;
  const res = await authFetch(url, { method: "DELETE" });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل حذف سجل الحضور: ${msg}`);
  }
  invalidateCache(CACHE_KEYS.STUDENT_ATTENDANCE);
}




