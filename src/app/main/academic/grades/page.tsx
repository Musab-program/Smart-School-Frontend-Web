"use client";

import React, { useState, useEffect } from "react";
import { getGrades, addGrade, updateGrade, deleteGrade } from "@/lib/api";
import { Grade } from "@/types/grade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, GraduationCap, BookOpen, Layers, Users } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Grade>({
    name: "",
    stage: "ابتدائي",
    capacity: 30,
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Grade | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getGrades();
      setGrades(data || []);
    } catch (err) {
      console.error("فشل جلب الصفوف:", err);
      setError("فشل في تحميل بيانات الصفوف");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingGrade(null);
    setForm({ name: "", stage: "ابتدائي", capacity: 30 });
    setIsDialogOpen(true);
  };

  const openEditModal = (grade: Grade) => {
    setEditingGrade(grade);
    setForm({
      id: grade.id,
      name: grade.name,
      stage: grade.stage || "ابتدائي",
      capacity: grade.capacity || 30,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingGrade && editingGrade.id) {
        await updateGrade(form);
      } else {
        await addGrade(form);
      }
      setIsDialogOpen(false);
      await loadData();
    } catch (err) {
      console.error("فشل حفظ الصف:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) return;
    try {
      setIsDeleting(true);
      await deleteGrade(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error("فشل حذف الصف:", err);
      alert(err instanceof Error ? err.message : "فشل حذف الصف");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredGrades = grades.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = React.useMemo(() => {
    const total = grades.length;
    const primary = grades.filter((g) => g.stage.includes("ابتدائي")).length;
    const preparatory = grades.filter((g) => g.stage.includes("إعدادي") || g.stage.includes("أساسي")).length;
    const secondary = grades.filter((g) => g.stage.includes("ثانوي")).length;
    const totalCapacity = grades.reduce((acc, g) => acc + (Number(g.capacity) || 0), 0);
    return { total, primary, preparatory, secondary, totalCapacity };
  }, [grades]);

  return (
    <div className="p-6 min-h-screen bg-gray-50/50" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-r-4 border-lime-700 pr-3">
            إدارة الصفوف والمراحل الدراسية
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            تعريف المراحل التعليمية (ابتدائي، إعدادي، ثانوي) والصفوف وسعتها الاستيعابية
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالصف أو المرحلة..."
              className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-700"
            />
          </div>
          <Button
            onClick={openAddModal}
            className="bg-lime-800 hover:bg-lime-900 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة صف جديد
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="shadow-md hover:shadow-lg transition-all text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <BookOpen className="w-9 h-9 text-blue-700" />
            <CardTitle className="text-base font-medium">
              إجمالي الصفوف
              <div className="text-2xl font-bold text-blue-600 mt-1">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">كافة الصفوف المسجلة بالمدرسة</div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <GraduationCap className="w-9 h-9 text-green-700" />
            <CardTitle className="text-base font-medium">
              المرحلة الثانوية
              <div className="text-2xl font-bold text-green-600 mt-1">{stats.secondary}</div>
              <div className="text-xs text-gray-500 mt-1">صفوف المرحلة الثانوية</div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <Layers className="w-9 h-9 text-purple-700" />
            <CardTitle className="text-base font-medium">
              المرحلة الأساسية
              <div className="text-2xl font-bold text-purple-600 mt-1">{stats.primary + stats.preparatory}</div>
              <div className="text-xs text-gray-500 mt-1">صفوف الابتدائي والإعدادي</div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <Users className="w-9 h-9 text-amber-600" />
            <CardTitle className="text-base font-medium">
              السعة الإجمالية
              <div className="text-2xl font-bold text-amber-600 mt-1">{stats.totalCapacity}</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي مقاعد الطلاب المتاحة</div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-lime-700 animate-spin" />
            <span className="mr-3 text-gray-600">جاري تحميل بيانات الصفوف...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
            <Button onClick={loadData} variant="outline" className="mt-3">
              إعادة المحاولة
            </Button>
          </div>
        ) : filteredGrades.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-base font-semibold">لا توجد صفوف دراسية مضافة حتى الآن</p>
            <Button onClick={openAddModal} variant="outline" className="mt-4 text-lime-800 border-lime-800">
              إضافة أول صف
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-sm font-semibold text-gray-700">اسم الصف</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">المرحلة الدراسية</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">السعة الاستيعابية</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-900">{grade.name}</td>
                    <td className="p-4 text-sm text-gray-700 font-medium">
                      <span className="px-3 py-1 bg-lime-50 text-lime-800 rounded-full text-xs font-bold border border-lime-200">
                        {grade.stage}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-semibold">{grade.capacity} طالب</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(grade)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(grade)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* نافذة الإضافة والتعديل */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 border-r-4 border-lime-700 pr-2">
              {editingGrade ? "تعديل بيانات الصف" : "إضافة صف دراسي جديد"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              أدخل بيانات الصف والمرحلة التعليمية ثم اضغط حفظ
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="gradeName">
                اسم الصف الدراسي <span className="text-red-500">*</span>
              </Label>
              <Input
                id="gradeName"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: الصف الأول الابتدائي"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeStage">
                المرحلة التعليمية <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.stage}
                onValueChange={(val) => setForm({ ...form, stage: val })}
              >
                <SelectTrigger id="gradeStage">
                  <SelectValue placeholder="اختر المرحلة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="تمهيدي / روضة">تمهيدي / روضة</SelectItem>
                  <SelectItem value="ابتدائي">ابتدائي</SelectItem>
                  <SelectItem value="إعدادي / متوسط">إعدادي / متوسط</SelectItem>
                  <SelectItem value="ثانوي">ثانوي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeCapacity">
                السعة الاستيعابية للطلاب <span className="text-red-500">*</span>
              </Label>
              <Input
                id="gradeCapacity"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                required
              />
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-lime-800 hover:bg-lime-900 text-white">
                {isSubmitting ? "جاري الحفظ..." : editingGrade ? "تحديث الصف" : "إضافة الصف"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">تأكيد حذف الصف</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              هل أنت متأكد من رغبتك في حذف الصف <span className="font-bold text-gray-900">"{deleteTarget?.name}"</span>؟ قد يؤدي هذا إلى تعذر الوصول إلى الشعب والطلاب المرتبطين به.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
