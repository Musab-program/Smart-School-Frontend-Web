"use client";

// import guardiansData from "../../../../../data/guardian.json"; // تأكد من المسار الصحيح لملف JSON
import { useSearchParams } from "next/navigation";

// import { getGuardianById } from "@/lib/Dia-api";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getRelationTypes,
  addGuardian,
  updateGuardian,
  getGuardianById,
  type GuardianUpsertInput,
} from "@/lib/Dia-api";
import { FaLess } from "react-icons/fa";
// import { getGuardianById } from "../main/api-providers";

// type CreateGuardianPayload = {
//   fullName: string;
//   phone: string;
//   email?: string;
//   relation: string;
//   isActive?: string;
//   address?: string;
//   notes?: string;
//   secondryPhone?: string;
//   password?: string;
//   gender?: string;
//   relationName?: string;
//   userId?: number | string;
//   dateOfBirth?: string;
// };

export default function Page() {
  // 1. استدعاء الدالة للحصول على الكائن
  const searchParams = useSearchParams();
  // 2. استخدام .get() على الكائن
  const id = searchParams.get("id");
  // جلب البيانات الممررة من الـ Query Parameters
  const dataParam = searchParams.get("data");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<GuardianUpsertInput>({
    fullName: "",
    phone: "",
    email: "",
    relation: "",
    relationName: "",
    isActive: false,
    address: "",
    secondryPhone: "",
    password: "",
    gender: "",
    userId: 0,
    dateOfBirth: "2000-01-01T00:00:00.000Z",
  });

  type RelationOption = {
    id: number | string;
    name?: string;
    relationship?: string;
    relationName?: string;
  };
  const [relationData, setRelationData] = useState<RelationOption[]>([]);

  useEffect(() => {
    // Prefill only when editing with id; otherwise clear any stale draft
    if (!id) {
      setForm({
        fullName: "",
        phone: "",
        email: "",
        relation: "",
        relationName: "",
        isActive: false,
        address: "",
        secondryPhone: "",
        password: "",
        gender: "",
        userId: 0,
        dateOfBirth: "2000-01-01T00:00:00.000Z",
      });
      return;
    }

    if (dataParam) {
      try {
        // فك الترميز والتحويل من JSON
        const g = JSON.parse(decodeURIComponent(dataParam));

        // منطق تطبيع حالة التفعيل
        const rawActive =
          g.isActive ??
          g.IsActive ??
          g.active ??
          g.Active ??
          g.status ??
          g.Status;
        const normalizedActive =
          rawActive === true ||
          rawActive === 1 ||
          rawActive === "1" ||
          rawActive === "true" ||
          rawActive === "مفعل"
            ? true
            : false;

        // ✅ ملء النموذج بالبيانات الممررة
        setForm({
          fullName: g.userName ?? g.fullName ?? "",
          phone: g.phone ?? "",
          email: g.email ?? "",
          relation: g.relationTypeId?.toString() ?? "",
          relationName: g.relationType?.name ?? g.relationName ?? "", // جلب اسم العلاقة
          isActive: normalizedActive,
          address: g.address ?? "",
          secondryPhone:
            g.secondryPhone ?? g.secondaryPhone ?? g.altPhone ?? "",
          password: "", // لا يتم تعبئة كلمة المرور أبداً
          gender:
            g.gender?.toString().toLowerCase() === "male" || g.gender === "ذكر"
              ? "male"
              : g.gender?.toString().toLowerCase() === "female" ||
                g.gender === "أنثى"
              ? "female"
              : "",
          userId: g.userId ?? g.UserID ?? 0,
          dateOfBirth:
            g.dateOfBirth ?? g.DateOfBirth ?? "2000-01-01T00:00:00.000Z",
        });
        console.log("تم ملء النموذج بالبيانات الممررة (Query Param) بنجاح.");
        return; // ⭐️ إنهاء الدالة وتجنب استدعاء API الإضافي
      } catch (e) {
        console.error(
          "فشل في قراءة البيانات الممررة. سيتم جلب البيانات من API كخطة احتياطية.",
          e
        );
        // نتابع لمنطق الجلب من API في الأسفل
      }
    }

    // 2. 🚀 منطق وضع التعديل: الجلب من API
    async function fetchGuardianData(guardianId: string) {
      try {
        // ⭐️ الجلب المباشر من API لضمان أحدث البيانات
        const g = await getGuardianById(guardianId);
        // منطق تطبيع حالة التفعيل (مهم)
        const rawActive =
          g.isActive ??
          g.IsActive ??
          g.active ??
          g.Active ??
          g.status ??
          g.Status;
        const normalizedActive =
          rawActive === true ||
          rawActive === 1 ||
          rawActive === "true" ||
          rawActive === "مفعل"
            ? true
            : false;

        setForm({
          fullName: g.userName ?? g.fullName ?? "",
          phone: g.phone ?? "",
          email: g.email ?? "",
          relation: g.relationTypeId?.toString() ?? "",
          relationName: g.relationType?.name ?? "", // جلب اسم العلاقة للتحقق من الصحة
          isActive: normalizedActive,
          address: g.address ?? "",
          secondryPhone:
            g.secondryPhone ?? g.secondaryPhone ?? g.altPhone ?? "",
          password: "", // عدم تعبئة كلمة المرور أبداً
          gender:
            g.gender?.toString().toLowerCase() === "male" || g.gender === "ذكر"
              ? "male"
              : g.gender?.toString().toLowerCase() === "female" ||
                g.gender === "أنثى"
              ? "female"
              : "",
          // ✅ الحقول الحاسمة للتحديث
          userId: g.userId ?? g.UserID ?? 0,
          dateOfBirth:
            g.dateOfBirth ?? g.DateOfBirth ?? "2000-01-01T00:00:00.000Z",
        });
      } catch (e) {
        console.error("فشل في جلب بيانات ولي الأمر للتعديل:", e);
        setError("تعذر تحميل بيانات ولي الأمر. حاول مجدداً.");
      }
    }

    if (id) {
      fetchGuardianData(id);
    }
  }, [id, dataParam]);

  // Ensure relation is selected by name when editing and only name is available
  useEffect(() => {
    if (!id) return;
    if (!relationData?.length) return;
    if (form.relation) return; // already set by id
    const storedGuardian = localStorage.getItem("editingGuardian");
    if (!storedGuardian) return;
    const g = JSON.parse(storedGuardian);
    const label =
      g?.relationType?.name ||
      g?.relationTypeName ||
      g?.relationName ||
      g?.relation;
    if (!label) return;
    const match = (relationData as RelationOption[]).find(
      (r) => (r.name || r.relationship || r.relationName) === label
    );
    if (match?.id != null) {
      setForm((p) => ({ ...p, relation: String(match.id) }));
    }
  }, [id, relationData, form.relation]);

  useEffect(() => {
    async function fetchRelations() {
      try {
        const relations = await getRelationTypes();
        setRelationData(relations);
      } catch (err) {
        console.error("فشل في جلب العلاقات:", err);
      }
    }
    fetchRelations();
  }, []);

  const handleChange =
    (field: keyof GuardianUpsertInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. التحقق من الصحة (Validation)
    setError(null);
    setSuccess(null);

    if (!form.fullName.trim()) {
      setError("الاسم الكامل مطلوب");
      return;
    }
    if (!/^\+?\d{8,15}$/.test(form.phone.trim())) {
      setError("رقم الجوال غير صالح");
      return;
    }

    setSubmitting(true);

    // 2. ✅ تجهيز الحمولة (Payload) الكاملة والدقيقة للإرسال
    // البحث عن الاسم الحقيقي لصلة القرابة من قائمة البيانات
    const selectedRelation = relationData.find(
      (r) => (r.id?.toString() ?? String(r.id)) === form.relation
    );
    const relationName =
      selectedRelation?.name ??
      selectedRelation?.relationship ??
      selectedRelation?.relationName ??
      "";

    const payload: GuardianUpsertInput = {
      ...form,
      // تمرير الاسم الحقيقي الذي تطلبه الـ API
      relationName: relationName,
      // تمرير حقول التحديث الحساسة
      userId: form.userId,
      dateOfBirth: form.dateOfBirth,
    };

    payload.isActive = Boolean(form.isActive);

    console.log("🚀 Final payload to API:", payload);

    try {
      let successMessage = "";

      if (id) {
        // استخدام الحمولة الكاملة
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateGuardian(id, payload as any);
        successMessage = "تم تحديث بيانات ولي الأمر بنجاح.";
      } else {
        // استخدام الحمولة الكاملة
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await addGuardian(payload as any);
        successMessage = "تمت إضافة ولي الأمر بنجاح.";
      }

      setSuccess(successMessage);

      // 3. ✅ الحل لمشكلة عدم ظهور البيانات الجديدة: فرض تحديث بيانات الصفحة
      router.refresh();

      // 4. ✅ التنظيف بعد النجاح (إعادة تهيئة الحالة بشكل كامل)
      // لا يوجد داعي لـ localStorage.removeItem("editingGuardian"); بعد الآن
      setForm({
        fullName: "",
        phone: "",
        email: "",
        relation: "",
        relationName: "", // يجب مسح اسم العلاقة أيضاً
        isActive: false,
        address: "",
        secondryPhone: "",
        password: "",
        gender: "",
        userId: 0, // يجب مسح userId
        dateOfBirth: "2000-01-01T00:00:00.000Z", // مسح تاريخ الميلاد
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "تعديل ولي أمر" : "إضافة ولي أمر"}</CardTitle>
          <CardDescription>
            {id
              ? "يمكنك تعديل بيانات ولي الأمر هنا"
              : "أدخل بيانات ولي الأمر ثم اضغط على حفظ"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* الحقول في Grid متجاوبة */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  الاسم الكامل<span className="text-destructive"> *</span>
                </Label>
                <input
                  type="text"
                  id="fullName"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="مثال: أحمد محمد عبدالله"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  رقم الجوال<span className="text-destructive"> *</span>
                </Label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="مثال: 7777777777"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                  inputMode="tel"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <input
                  id="address"
                  placeholder="المدينة، الحي، الشارع"
                  value={form.address}
                  onChange={handleChange("address")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div className="space-y-2">
                <Label>نشاط الحساب</Label>
                <Select
                  value={form.isActive ? "true" : "false"}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      isActive: v === "true",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع نشاط الحساب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">مفعل</SelectItem>
                    <SelectItem value="false">غير مفعل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>صلة القرابة</Label>
                <Select
                  value={form.relation?.toString() ?? ""}
                  onValueChange={(v) => {
                    const selectedRelation = relationData.find(
                      (r) => (r.id?.toString() ?? String(r.id)) === v
                    );
                    // 2. استخلاص الاسم بأي شكل متاح
                    const name =
                      selectedRelation?.name ??
                      selectedRelation?.relationship ??
                      selectedRelation?.relationName ??
                      "";

                    // 3. تحديث الحالة بالمعرف والاسم معًا
                    setForm((p) => ({
                      ...p,
                      relation: v,
                      relationName: name, // ✅ تعيين اسم العلاقة
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر صلة القرابة" />
                  </SelectTrigger>
                  <SelectContent>
                    {(relationData as RelationOption[] | undefined)?.map(
                      (relation) => (
                        <SelectItem
                          key={relation.id}
                          value={
                            relation.id?.toString?.() ?? String(relation.id)
                          }
                        >
                          {relation.name ??
                            relation.relationship ??
                            relation.relationName ??
                            ""}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم هاتف آخر</Label>
                <input
                  id="phone"
                  placeholder="رقم هاتف للتواصل معه في حالات الطوارئ"
                  value={form.secondryPhone}
                  onChange={handleChange("secondryPhone")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <input
                  id="password"
                  type="password"
                  placeholder=" ************* "
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>

              <div className="space-y-2">
                <Label>الجنس</Label>
                <Select
                  value={form.gender ?? ""}
                  onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر جنس ولي الأمر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-emerald-700 text-sm">
                {success}
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2 text-white font-semibold bg-lime-800 rounded-lg hover:bg-lime-900 transition-colors"
              >
                {submitting ? "جارِ الحفظ..." : id ? "تحديث" : "حفظ"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  localStorage.removeItem("editingGuardian");
                  router.back();
                }}
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
