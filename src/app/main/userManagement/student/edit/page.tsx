"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getStudentById,
  addStudent,
  updateStudent,
  getGuardians,
  getGroups,
  getRoles,
} from "@/lib/api";
import { Guardian } from "@/types/guardian";
import { Group } from "@/types/group";
import { Role } from "@/types/role";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight, Save } from "lucide-react";

export default function StudentFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const studentId = idParam ? Number(idParam) : null;
  const isEditMode = Boolean(studentId);

  // Lists for dropdown selections
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Loading & submission state
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    userPasswordInput: "",
    userPhone: "",
    userDateOfBirth: "2010-01-01",
    isActiveUser: true,
    userAddress: "",
    userGender: "ذكر",
    roleId: 0,
    guardianId: 0,
    groupId: 0,
  });

  // Load dropdown data and student details if edit mode
  useEffect(() => {
    async function init() {
      try {
        setIsInitializing(true);
        const [guardiansData, groupsData, rolesData] = await Promise.all([
          getGuardians().catch(() => []),
          getGroups().catch(() => []),
          getRoles().catch(() => []),
        ]);

        setGuardians(guardiansData || []);
        setGroups(groupsData || []);
        setRoles(rolesData || []);

        // Find "طالب" role id
        const studentRole = (rolesData || []).find((r) => r.name === "طالب" || r.RoleName === "طالب");
        const defaultRoleId = studentRole?.id || studentRole?.RoleId || 4;

        if (studentId) {
          const student = await getStudentById(studentId);
          if (student) {
            setForm({
              userName: student.userName || "",
              userEmail: student.userEmail || "",
              userPasswordInput: "",
              userPhone: student.userPhone || "",
              userDateOfBirth: student.userDateOfBirth
                ? student.userDateOfBirth.slice(0, 10)
                : "2010-01-01",
              isActiveUser: student.isActiveUser ?? true,
              userAddress: student.userAddress || "",
              userGender: student.userGender || "ذكر",
              roleId: student.roleId || defaultRoleId,
              guardianId: student.guardianId || 0,
              groupId: student.groupId || 0,
            });
          }
        } else {
          setForm((prev) => ({
            ...prev,
            roleId: defaultRoleId,
            guardianId: (guardiansData || [])[0]?.id || 0,
            groupId: (groupsData || [])[0]?.id || 0,
          }));
        }
      } catch (err) {
        console.error("فشل في تهيئة النموذج:", err);
        setMessage({ type: "error", text: "فشل في تحميل بيانات النموذج" });
      } finally {
        setIsInitializing(false);
      }
    }
    init();
  }, [studentId]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!form.userName.trim()) {
      setMessage({ type: "error", text: "اسم الطالب مطلوب" });
      return;
    }
    if (!form.userEmail.trim()) {
      setMessage({ type: "error", text: "البريد الإلكتروني مطلوب" });
      return;
    }
    if (!isEditMode && !form.userPasswordInput.trim()) {
      setMessage({ type: "error", text: "كلمة المرور مطلوبة عند إضافة طالب جديد" });
      return;
    }
    if (!form.guardianId) {
      setMessage({ type: "error", text: "يرجى اختيار ولي الأمر" });
      return;
    }
    if (!form.groupId) {
      setMessage({ type: "error", text: "يرجى اختيار الشعبة / المجموعة" });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        id: studentId || 0,
        roleId: Number(form.roleId) || 4,
        guardianId: Number(form.guardianId),
        groupId: Number(form.groupId),
        userPasswordInput: form.userPasswordInput || undefined,
        userDateOfBirth: new Date(form.userDateOfBirth).toISOString(),
        registerDate: new Date().toISOString(),
      };

      if (isEditMode) {
        await updateStudent(payload);
        setMessage({ type: "success", text: "تم تحديث بيانات الطالب بنجاح!" });
      } else {
        await addStudent(payload);
        setMessage({ type: "success", text: "تمت إضافة الطالب الجديد بنجاح!" });
      }

      setTimeout(() => {
        router.push("/main/userManagement/student/main");
      }, 1500);
    } catch (err) {
      console.error("فشل حفظ بيانات الطالب:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "حدث خطأ أثناء حفظ البيانات",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen" dir="rtl">
        <Loader2 className="w-8 h-8 text-lime-700 animate-spin" />
        <span className="mr-3 text-gray-700">جاري تحميل بيانات النموذج...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8" dir="rtl">
      {/* شريط الرجوع */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/main/userManagement/student/main"
          className="text-gray-600 hover:text-lime-800 flex items-center gap-1 text-sm font-semibold transition-colors"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          العودة إلى جدول الطلاب
        </Link>
      </div>

      <Card className="shadow-lg border-gray-100">
        <CardHeader className="border-b border-gray-100 pb-5">
          <CardTitle className="text-2xl font-bold text-gray-900 border-r-4 border-lime-700 pr-3">
            {isEditMode ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
          </CardTitle>
          <CardDescription className="text-gray-500 pr-3 mt-1">
            {isEditMode
              ? "قم بتحديث بيانات الطالب ثم اضغط على زر حفظ التغييرات"
              : "يرجى ملء جميع الحقول المطلوبة لإنشاء حساب الطالب الجديد"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {message && (
            <div
              className={`p-4 rounded-lg mb-6 text-sm font-semibold ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* القسم الأول: المعلومات الأساسية */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                1. البيانات الشخصية
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userName">
                    الاسم الكامل للطالب <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="userName"
                    value={form.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    placeholder="مثال: أحمد محمد علي"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userGender">
                    الجنس <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.userGender}
                    onValueChange={(val) => handleChange("userGender", val)}
                  >
                    <SelectTrigger id="userGender">
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ذكر">ذكر</SelectItem>
                      <SelectItem value="أنثى">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userDateOfBirth">
                    تاريخ الميلاد <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="userDateOfBirth"
                    type="date"
                    value={form.userDateOfBirth}
                    onChange={(e) => handleChange("userDateOfBirth", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userAddress">العنوان السكني</Label>
                  <Input
                    id="userAddress"
                    value={form.userAddress}
                    onChange={(e) => handleChange("userAddress", e.target.value)}
                    placeholder="المدينة، الحي، الشارع"
                  />
                </div>
              </div>
            </div>

            {/* القسم الثاني: بيانات الحساب والاتصال */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                2. بيانات الحساب والاتصال
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="userEmail"
                    type="email"
                    dir="ltr"
                    value={form.userEmail}
                    onChange={(e) => handleChange("userEmail", e.target.value)}
                    placeholder="student@school.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userPhone">رقم هاتف الطالب</Label>
                  <Input
                    id="userPhone"
                    dir="ltr"
                    value={form.userPhone}
                    onChange={(e) => handleChange("userPhone", e.target.value)}
                    placeholder="05XXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userPasswordInput">
                    كلمة المرور {isEditMode ? "(اتركها فارغة إذا لم ترغب بالتغيير)" : <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="userPasswordInput"
                    type="password"
                    dir="ltr"
                    value={form.userPasswordInput}
                    onChange={(e) => handleChange("userPasswordInput", e.target.value)}
                    placeholder="••••••••"
                    required={!isEditMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActiveUser">حالة تفعيل الحساب</Label>
                  <Select
                    value={form.isActiveUser ? "true" : "false"}
                    onValueChange={(val) => handleChange("isActiveUser", val === "true")}
                  >
                    <SelectTrigger id="isActiveUser">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">نشط</SelectItem>
                      <SelectItem value="false">معطل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* القسم الثالث: الروابط المدرسية (ولي الأمر والمجموعة) */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                3. الربط الأكاديمي والعائلي
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="guardianId">
                    ولي الأمر <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.guardianId ? String(form.guardianId) : ""}
                    onValueChange={(val) => handleChange("guardianId", Number(val))}
                  >
                    <SelectTrigger id="guardianId">
                      <SelectValue placeholder="اختر ولي الأمر" />
                    </SelectTrigger>
                    <SelectContent>
                      {guardians.map((g) => (
                        <SelectItem key={g.id} value={String(g.id)}>
                          {g.userName} ({g.phone || g.email || `معرف ${g.id}`})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groupId">
                    الشعبة / المجموعة <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.groupId ? String(form.groupId) : ""}
                    onValueChange={(val) => handleChange("groupId", Number(val))}
                  >
                    <SelectTrigger id="groupId">
                      <SelectValue placeholder="اختر الشعبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={String(group.id)}>
                          {group.name} {group.gradeName ? `(${group.gradeName})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <Link href="/main/userManagement/student/main">
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  إلغاء
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-lime-800 hover:bg-lime-900 text-white min-w-[140px] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isEditMode ? "حفظ التغييرات" : "إضافة الطالب"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
