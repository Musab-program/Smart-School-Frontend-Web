"use client";

import React, { useState, useEffect } from "react";
import { getGroups, addGroup, updateGroup, deleteGroup, getGrades } from "@/lib/api";
import { Group } from "@/types/group";
import { Grade } from "@/types/grade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, Users } from "lucide-react";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Group>({
    name: "",
    gradeId: 0,
    academicYear: new Date().getFullYear().toString(),
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [groupsData, gradesData] = await Promise.all([
        getGroups(),
        getGrades().catch(() => []),
      ]);
      setGroups(groupsData || []);
      setGrades(gradesData || []);
    } catch (err) {
      console.error("فشل جلب المجموعات:", err);
      setError("فشل في تحميل بيانات الشعب والمجموعات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const gradesMap = React.useMemo(() => {
    const map = new Map<number, string>();
    grades.forEach((g) => {
      if (g.id) map.set(g.id, g.name);
    });
    return map;
  }, [grades]);

  const openAddModal = () => {
    setEditingGroup(null);
    setForm({
      name: "",
      gradeId: grades[0]?.id || 0,
      academicYear: new Date().getFullYear().toString(),
    });
    setIsDialogOpen(true);
  };

  const openEditModal = (group: Group) => {
    setEditingGroup(group);
    setForm({
      id: group.id,
      name: group.name,
      gradeId: group.gradeId,
      academicYear: group.academicYear
        ? new Date(group.academicYear).getFullYear().toString()
        : new Date().getFullYear().toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.gradeId) return;

    try {
      setIsSubmitting(true);
      const payload: Group = {
        ...form,
        gradeId: Number(form.gradeId),
        academicYear: new Date(`${form.academicYear}-09-01`).toISOString(),
      };

      if (editingGroup && editingGroup.id) {
        await updateGroup(payload);
      } else {
        await addGroup(payload);
      }
      setIsDialogOpen(false);
      await loadData();
    } catch (err) {
      console.error("فشل حفظ الشعبة:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) return;
    try {
      setIsDeleting(true);
      await deleteGroup(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error("فشل حذف الشعبة:", err);
      alert(err instanceof Error ? err.message : "فشل حذف الشعبة");
    } finally {
      setIsDeleting(false);
    }
  };

  const [selectedGradeId, setSelectedGradeId] = useState<string>("ALL");

  const stats = React.useMemo(() => {
    const total = groups.length;
    const gradesCovered = new Set(groups.map((g) => g.gradeId)).size;
    const currentYear = new Date().getFullYear();
    const currentYearGroups = groups.filter((g) => {
      if (!g.academicYear) return false;
      return new Date(g.academicYear).getFullYear() === currentYear;
    }).length;
    return { total, gradesCovered, currentYearGroups };
  }, [groups]);

  const filteredGroups = groups.filter((g) => {
    const gradeName = g.gradeName || gradesMap.get(g.gradeId) || "";
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gradeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade =
      selectedGradeId === "ALL" || String(g.gradeId) === selectedGradeId;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50/50" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-r-4 border-lime-700 pr-3">
            إدارة الشعب والمجموعات الدراسية
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            إنشاء الشعب وتوزيع الفصول وربطها بالصفوف للعام الدراسي
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={openAddModal}
            className="bg-lime-800 hover:bg-lime-900 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة شعبة جديدة
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">إجمالي الشعب الدراسية</div>
            <div className="text-2xl font-bold text-lime-800 mt-1">{stats.total}</div>
            <div className="text-xs text-gray-400 mt-1">كافة الفصول والشعب المسجلة</div>
          </div>
          <div className="p-3 bg-lime-100 rounded-lg text-lime-800">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">الصفوف التي تضم شعباً</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{stats.gradesCovered}</div>
            <div className="text-xs text-gray-400 mt-1">من أصل {grades.length} صف دراسي</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">شعب العام الحالي</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{stats.currentYearGroups}</div>
            <div className="text-xs text-gray-400 mt-1">العام الدراسي {new Date().getFullYear()}</div>
          </div>
          <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالشعبة أو الصف..."
            className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Label className="text-sm font-medium text-gray-600 whitespace-nowrap">
            تصفية حسب الصف:
          </Label>
          <Select value={selectedGradeId} onValueChange={setSelectedGradeId}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="كافة الصفوف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">كافة الصفوف الدراسية</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade.id} value={String(grade.id)}>
                  {grade.name} ({grade.stage})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-lime-700 animate-spin" />
            <span className="mr-3 text-gray-600">جاري تحميل بيانات الشعب...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
            <Button onClick={loadData} variant="outline" className="mt-3">
              إعادة المحاولة
            </Button>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-base font-semibold">لا توجد شعب دراسية مضافة حتى الآن</p>
            <Button onClick={openAddModal} variant="outline" className="mt-4 text-lime-800 border-lime-800">
              إضافة أول شعبة
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-sm font-semibold text-gray-700">اسم الشعبة / المجموعة</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">الصف الدراسي</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">السنة الدراسية</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGroups.map((group) => {
                  const gradeName = group.gradeName || gradesMap.get(group.gradeId) || `صف ${group.gradeId}`;
                  const year = group.academicYear
                    ? new Date(group.academicYear).getFullYear()
                    : "-";
                  return (
                    <tr key={group.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4 text-sm font-bold text-gray-900">{group.name}</td>
                      <td className="p-4 text-sm font-semibold text-lime-800">{gradeName}</td>
                      <td className="p-4 text-sm text-gray-600">{year} / {Number(year) + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(group)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(group)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              {editingGroup ? "تعديل بيانات الشعبة" : "إضافة شعبة جديدة"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              اختر الصف الدراسي وحدد اسم الشعبة والسنة الأكاديمية
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="groupName">
                اسم الشعبة <span className="text-red-500">*</span>
              </Label>
              <Input
                id="groupName"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: الشعبة الأولى (أ)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeId">
                الصف الدراسي التابع له <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.gradeId ? String(form.gradeId) : ""}
                onValueChange={(val) => setForm({ ...form, gradeId: Number(val) })}
              >
                <SelectTrigger id="gradeId">
                  <SelectValue placeholder="اختر الصف" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={String(grade.id)}>
                      {grade.name} ({grade.stage})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">
                سنة البداية الأكاديمية <span className="text-red-500">*</span>
              </Label>
              <Input
                id="academicYear"
                type="number"
                min={2020}
                max={2040}
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                required
              />
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-lime-800 hover:bg-lime-900 text-white">
                {isSubmitting ? "جاري الحفظ..." : editingGroup ? "تحديث الشعبة" : "إضافة الشعبة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">تأكيد حذف الشعبة</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              هل أنت متأكد من رغبتك في حذف الشعبة <span className="font-bold text-gray-900">"{deleteTarget?.name}"</span>؟ سيؤثر هذا على الطلاب المسجلين بها.
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
