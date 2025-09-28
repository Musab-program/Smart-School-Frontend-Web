"use client";

import * as React from "react";
import { useState } from "react";
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

type CreateGuardianPayload = {
  fullName: string;
  phone: string;
  email?: string;
  relation: string;
  nationalId?: string;
  address?: string;
  notes?: string;
};

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<CreateGuardianPayload>({
    fullName: "",
    phone: "",
    email: "",
    relation: "father",
    nationalId: "",
    address: "",
    notes: "",
  });

  const handleChange =
    (field: keyof CreateGuardianPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    try {
      const res = await fetch("/api/guardians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "تعذر إضافة ولي الأمر");
      }

      setSuccess("تمت إضافة ولي الأمر بنجاح");
      setForm({
        fullName: "",
        phone: "",
        email: "",
        relation: "father",
        nationalId: "",
        address: "",
        notes: "",
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
          <CardTitle>إضافة ولي أمر</CardTitle>
          <CardDescription>
            أدخل بيانات ولي الأمر ثم اضغط على حفظ
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
                  placeholder="مثال: 9665xxxxxxxx"
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
                <Label>صلة القرابة</Label>
                <Select
                  value={form.relation}
                  onValueChange={(v) => setForm((p) => ({ ...p, relation: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر صلة القرابة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">أب</SelectItem>
                    <SelectItem value="mother">أم</SelectItem>
                    <SelectItem value="brother">أخ</SelectItem>
                    <SelectItem value="sister">أخت</SelectItem>
                    <SelectItem value="guardian">ولي أمر آخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalId">رقم الهوية</Label>
                <input
                  id="nationalId"
                  placeholder="رقم الهوية الوطنية/الإقامة"
                  value={form.nationalId}
                  onChange={handleChange("nationalId")}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <textarea
                id="notes"
                placeholder="أي ملاحظات إضافية"
                value={form.notes}
                onChange={handleChange("notes")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
              />
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
                className="w-full sm:w-auto px-6 py-2 text-white font-semibold bg-lime-700 rounded-lg hover:bg-lime-800 transition-colors"
              >
                {submitting ? "جارِ الحفظ..." : "حفظ"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
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
