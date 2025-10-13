import { Role } from "@/types/role";
import { Specialty } from "@/types/specialty";
import { Teacher, TeacherCreationPayload, TeacherUpdatePayload } from "@/types/teacher";
import { Guardian } from "@/types/guardian";
// <<<<<<< changes-musab
// // Node-only imports removed to avoid bundling in client
// =======
// import { isUtf8 } from "buffer";
// import * as fs from "fs/promises";
// import path from "path";
// import { json } from "stream/consumers";
// import { Relation } from "@/types/relation";
// >>>>>>> master

// Delegate reading mock files to server-only helper when needed
import { readJsonFile } from "@/lib/server-files";
import { error } from "console";

async function fetchData<T>(fileName: string): Promise<T> {
  return readJsonFile<T>(fileName);
}

function getAppBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const explicit = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}

export async function getTeacher() {
    const res =  await fetch("https://localhost:44363/api/Teachers/GetAllTeacher", { cache: "no-store" });
    if (!res.ok) throw new Error("فشل في جلب بيانات المعلمين ");
    const data = await res.json();
    return data.data;
}

// utils/api.ts

export async function addTeacher(dataToSend: TeacherCreationPayload): Promise<Teacher> {

  const url = 'https://localhost:44363/api/Teachers/AddTeacher';

  try {
    console.log(JSON.stringify(dataToSend))
    // 1. إرسال الطلب
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    // 2. تحليل جسم الاستجابة (JSON أو نص)
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body: unknown = isJson ? await response.json() : await response.text();

    // 3. التحقق من حالة الاستجابة (Success or Failure)
    if (!response.ok) {
      // 💡 منطق استخراج رسالة الخطأ من استجابة API (ممتاز!)
      const b = body as Record<string, unknown> | string;
      const msg =
        typeof b === 'object' && b !== null
          ? (b.message as string) || (b.title as string) || (b.detail as string) || JSON.stringify(b)
          : (b as string) || `فشل في إضافة المعلم. حالة الاستجابة: ${response.status}`;
      
      // إلقاء (Throw) كائن خطأ جديد يتضمن رسالة واضحة
      throw new Error(String(msg));
    }
    
    // 4. النجاح: إرجاع البيانات
    return body as Teacher;

  } catch (error) {
    // 5. التقاط الأخطاء العامة أو أخطاء الشبكة/التحليل
    
    console.error('فشل الاتصال أو معالجة الاستجابة:', error);
    
    // 🚨 التعديل الرئيسي: يجب إعادة نشر الخطأ لكي يراه الكود الذي استدعى الدالة
    // نضمن أننا نُلقي كائن Error، إذا لم يكن الخطأ الأصلي كذلك
    if (error instanceof Error) {
        throw error;
    }
    
    // إذا كان الخطأ شيئاً آخر (مثل سلسلة نصية، أو غير معرّف)
    throw new Error('حدث خطأ غير متوقع أثناء محاولة الاتصال بالـ API.');
  }
}

export async function updateTeacher(dataToSend: TeacherUpdatePayload): Promise<Teacher> {
  
  // 1. تجهيز البيانات للإرسال
  // const dataToSend = {
  //   dto: {
  //     ...payload,
  //     dateOfBirth: new Date(payload.dateOfBirth).toISOString(),
  //     salary: Number(payload.salary),
  //     specialtyId: Number(payload.specialtyId),
  //   },
  // } as const;

  // 2. بناء رابط API (يفترض أن ASP.NET API يستقبل المعرّف داخل جسم الطلب)
  // إذا كان API يتوقع الرابط هكذا: POST /api/Teachers/UpdateTeacher، فنستخدم الرابط الثابت أعلاه.
  // إذا كان API يتوقع الرابط هكذا: PUT /api/Teachers/{id}، يجب تغيير الرابط:
  // const url = `${API_BASE_URL}/${payload.id}`;
  const url = 'https://localhost:44363/api/Teachers/UpdateTeachers';
  const response = await fetch(url, {
    method: 'PUT', // 💡 تغيير نوع الطلب إلى PUT (هو النوع الأكثر شيوعاً للتعديل الكامل)
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend), // إرسال كامل كائن البيانات (بما في ذلك id)
  });
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body: unknown = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const b = body as Record<string, unknown> | string;
    const msg =
      typeof b === 'object' && b !== null
        ? (b.message as string) || (b.title as string) || (b.detail as string) || JSON.stringify(b)
        : (b as string) || 'فشل في تعديل المعلم';
    throw new Error(String(msg));
  }
  return body as Teacher;
  
  // إذا كان يرجع استجابة 204 No Content، فستحتاج إلى:
  // if (response.status === 204) { return payload as Teacher; }
}

// utils/api.ts (دالة الحذف المعدّلة)

/**
 * @function deleteTeacher
 * @description لإرسال طلب DELETE إلى API لحذف معلم باستخدام معرّف المعلم (id) في الـ Query String.
 * @param {number} id - المعرّف الرئيسي للمعلم المراد حذفه.
 * @returns {Promise<void>}
 */
export async function deleteTeacher(id: number): Promise<void> {
  // 1. إنشاء الرابط الديناميكي
  // الرابط الأساسي + id المعلم المُمرر
  const API_BASE_URL = 'https://localhost:44363/api/Teachers/DeleteTeacher?id=';
  const url = `${API_BASE_URL}${id}`; // 💡 إضافة id لجعل الرابط ديناميكيًا

  try {
      console.log(`جاري حذف المعلم ذو المعرّف: ${id}. الرابط: ${url}`);

      // 2. إرسال الطلب (DELETE)
      const response = await fetch(url, {
          method: 'DELETE', // 💡 يجب أن يكون DELETE
          // لا حاجة لـ 'Content-Type': 'application/json' ولا لـ body في هذه الحالة
          // لأن id يُمرر في الرابط (Query Parameter)
      });

      // 3. تحليل جسم الاستجابة (JSON أو نص)
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      // ملاحظة: الحذف الناجح غالباً يُرجع 204 No Content، ولا يوجد Body في هذه الحالة.
      const body: unknown = isJson ? await response.json() : await response.text();

      // 4. التحقق من حالة الاستجابة (Success or Failure)
      if (!response.ok) {
          // منطق استخراج رسالة الخطأ من استجابة API
          const b = body as Record<string, unknown> | string;
          const msg =
              typeof b === 'object' && b !== null
                  ? (b.message as string) || (b.title as string) || (b.detail as string) || JSON.stringify(b)
                  : (b as string) || `فشل في حذف المعلم. حالة الاستجابة: ${response.status}`;

          throw new Error(String(msg));
      }

      // 5. النجاح
      console.log(`تم حذف المعلم ذو المعرّف ${id} بنجاح.`);

  } catch (error) {
      // التقاط الأخطاء العامة أو أخطاء الشبكة/التحليل
      console.error('فشل الاتصال أو معالجة الاستجابة:', error);

      if (error instanceof Error) {
          throw error;
      }

      throw new Error('حدث خطأ غير متوقع أثناء محاولة الاتصال بالـ API.');
  }
}
export async function getSpecialty(): Promise<Specialty[]> {
  const base = getAppBaseUrl();
  const res =  await fetch(`${base}/api/specialties/get-all`, { cache: "no-store" });
  if (!res.ok) throw new Error("فشل في جلب بيانات التخصصات ");
  const data = await res.json();
  return data.data;
}

export async function getUsers(): Promise<User[]> {
  return fetchData<User[]>("users.json");
}

export async function getRoles(): Promise<Role[]> {
  return fetchData<Role[]>("role.json");
}

export async function getGuardian(): Promise<Guardian[]> {
  return fetchData<Guardian[]>("guardian.json");
}

export async function getRelation(): Promise<Relation[]> {
  return fetchData<Relation[]>("relation.json");
}

// export const api = {
//   get: async <T>(url: string): Promise<T> => {
//     const res = await fetch(url, { credentials: "include" })
//     if (!res.ok) throw new Error(`GET ${url} failed`)
//     return res.json()
//   },
//   post: async <T>(url: string, body: unknown): Promise<T> => {
//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(body),
//     })
//     if (!res.ok) throw new Error(`POST ${url} failed`)
//     return res.json()
//   },
// }
