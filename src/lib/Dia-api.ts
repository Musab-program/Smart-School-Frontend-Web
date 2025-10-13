// lib/api.ts
export async function getGuardians() {
  const res = await fetch(
    "https://localhost:44363/api/Guardian/GetAllGuardians",
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("فشل جلب بيانات أولياء الأمور");
  const data = await res.json();
  // console.log("🔍 Guardians API response:", data);
  return data.data;
}

export async function getGuardianById(id: string) {
  const res = await fetch(
    `https://localhost:44363/api/Guardian/GetGuardianById/${id}`
  );
  if (!res.ok) throw new Error("فشل في جلب بيانات ولي الأمر");
  const data = await res.json();
  return data.data; // assuming API returns { data, code, message }
}

// api.ts
export async function getRelationTypes() {
  const res = await fetch(
    "https://localhost:44363/api/RelationTypes/GetAllRelation"
  );

  if (!res.ok) throw new Error("فشل في جلب صلات القرابة");

  const result = await res.json();
  return result.data || result;
}

// Removed unused ApiError type

export type GuardianUpsertInput = {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  isActive?: string | boolean;
  relation: string | number;
  relationName?: string;
  gender?: string;
  password?: string;
  secondryPhone?: string;
  userId?: number | string;
  dateOfBirth?: string;
};

export async function addGuardian(data: GuardianUpsertInput) {
  const res = await fetch("https://localhost:44363/api/Guardian/AddGuardian", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // ⚠️ ملاحظة: يجب أن يرسل الـ ID (صفر) ليطابق هيكل الإضافة
      id: 0,

      // ✅ حقول العلاقة (المشكلة السابقة)
      relationTypeId: Number(data.relation),
      relationType: {
        id: Number(data.relation),
        name: data.relationName, // الاسم الحقيقي من النموذج
      },

      // ✅ حقول النموذج الأساسية
      userName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password, // يجب التأكد من تمرير حقل كلمة المرور
      gender: data.gender,
      address: data.address,
      secondryPhone: data.secondryPhone,
      userId: Number(data.userId),
      // 💡 الحقول الثابتة أو الافتراضية المطلوبة من الـ API
      roleID: 1, // افتراضياً، ولي الأمر هو Role ID 1

      // 💡 حالة التفعيل (تحويل الـ string إلى boolean)
      // isActive: data.isActive === "true",
      isActive: Boolean(data.isActive),


      // 💡 تاريخ الميلاد (تم وضع التاريخ الحالي كقيمة افتراضية، يجب تغييرها إذا كان الحقل في النموذج موجوداً)
      dateOfBirth: data.dateOfBirth || "2000-01-01T00:00:00.000Z",
    }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل الإضافة: ${msg}`);
  }

  return await res.json();
}

export async function updateGuardian(
  id: string | number,
  data: GuardianUpsertInput
) {
  // debugger;
  const res = await fetch(
    `https://localhost:44363/api/Guardian/UpdateGuardian`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // ✅ 1. إرسال الـ ID الحقيقي كجزء من جسم الطلب
        id: Number(id),
        // ✅ حقول العلاقة (تم حل مشكلة Name Required)
        relationTypeId: Number(data.relation),
        relationType: {
          id: Number(data.relation),
          name: data.relationName, // الاسم الحقيقي من النموذج
        },
        // ✅ حقول النموذج الأساسية (تستخدم نفس الأسماء في API)
        userName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password, // يتم إرساله (قد يحتاج إلى منطق لحذفه إذا لم يتم تغييره)
        gender: data.gender,
        address: data.address,
        secondryPhone: data.secondryPhone,
        // 💡 الحقول الثابتة أو الافتراضية المطلوبة من الـ API (مطابقة لعملية الإضافة)
        userId: 0,
        roleID: 1,
        // 💡 حالة التفعيل (تحويل الـ string إلى boolean)
        // isActive: data.isActive === "true",
      isActive: Boolean(data.isActive),

        // 💡 تاريخ الميلاد (قيمة افتراضية، يتم استبدالها بقيمة جُمعت من الجلب في وضع التعديل)
        dateOfBirth: "2000-01-01T00:00:00.000Z",
      }),
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`فشل التحديث: ${msg}`);
  }

  return await res.json();
}

export async function deleteGuardian(id: number | string) {
  const res = await fetch(
    `https://localhost:44363/api/Guardian/DeleteGuardian?id=${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`فشل الحذف: ${error}`);
  }

  return await res.json().catch(() => ({}));
}

// export async function deleteGuardian(id: number | string) {
//   const res = await fetch(`https://localhost:44363/api/Guardian/DeleteGuardian?id=${id}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(`فشل الحذف: ${err}`);
//   }

//   return await res.json().catch(() => ({}));
// }

// export async function addGuardian(payload: unknown) {
//   const res = await fetch("https://localhost:44363/api/Guardian/AddGuardian", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) {
//     const data: ApiError = await res.json().catch(() => undefined);
//     throw new Error(data?.message || "تعذر إضافة بيانات ولي الأمر");
//   }
//   return res.json().catch(() => ({}));
// }

// export async function updateGuardian(id: string, payload: unknown) {
//   const res = await fetch(
//     `https://localhost:44363/api/Guardian/UpdateGuardian/${id}`,
//     {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     }
//   );
//   if (!res.ok) {
//     await res.json().catch(() => ({}));
//     throw new Error("تعذر تحديث بيانات ولي ولي الأمر");
//   }
//   return res.json().catch(() => ({}));
// }
