"use client";

import React, { useState, useEffect } from "react";
import {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  getSubjectDetails,
} from "@/lib/api";
import { Subject } from "@/types/subject";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  CheckCircle,
  Layers,
} from "lucide-react";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectDetailsCount, setSubjectDetailsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [subjectsData, detailsData] = await Promise.all([
        getSubjects().catch(() => []),
        getSubjectDetails().catch(() => []),
      ]);
      setSubjects(subjectsData || []);
      setSubjectDetailsCount((detailsData || []).length);
    } catch (err) {
      console.error("فشل جلب المواد الدراسية:", err);
      setError("فشل في تحميل بيانات المواد الدراسية");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingSubject(null);
    setNameInput("");
    setIsDialogOpen(true);
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setNameInput(subject.name);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingSubject && editingSubject.id) {
        await updateSubject({ id: editingSubject.id, name: nameInput.trim() });
      } else {
        await addSubject({ name: nameInput.trim() });
      }
      setIsDialogOpen(false);
      await loadData();
    } catch (err) {
      console.error("فشل حفظ المادة الدراسية:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ المادة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) return;
    try {
      setIsDeleting(true);
      await deleteSubject(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error("فشل حذف المادة الدراسية:", err);
      alert(err instanceof Error ? err.message : "فشل حذف المادة الدراسية");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50/50" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-r-4 border-lime-700 pr-3">
            دليل المواد الدراسية
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            إدارة المقررات والمناهج الأساسية، الإضافة والتعديل والربط بالصفوف
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-lime-800 hover:bg-lime-900 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة مادة جديدة
        </Button>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">إجمالي المواد الدراسية</div>
            <div className="text-2xl font-bold text-lime-800 mt-1">{subjects.length}</div>
            <div className="text-xs text-gray-400 mt-1">المواد المعتمدة في النظام</div>
          </div>
          <div className="p-3 bg-lime-100 rounded-lg text-lime-800">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">المقررات المرتبطة بالصفوف</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{subjectDetailsCount}</div>
            <div className="text-xs text-gray-400 mt-1">حسب الخطة الدراسية السنوية</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">حالة اعتماد المنهج</div>
            <div className="text-2xl font-bold text-green-600 mt-1">مفعل 100%</div>
            <div className="text-xs text-gray-400 mt-1">جاهز لتوزيع الحصص الأسبوعية</div>
          </div>
          <div className="p-3 bg-green-100 rounded-lg text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-100 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم المادة الدراسية..."
            className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-700"
          />
        </div>
        <div className="text-xs text-gray-400 hidden sm:block">
          عرض {filteredSubjects.length} من أصل {subjects.length} مادة
        </div>
      </div>

      {/* جدول المواد */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-lime-700 animate-spin" />
            <span className="mr-3 text-gray-600">جاري تحميل المواد الدراسية...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
            <Button onClick={loadData} variant="outline" className="mt-3">
              إعادة المحاولة
            </Button>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-base font-semibold">لا توجد مواد دراسية مطابقة</p>
            <Button
              onClick={openAddModal}
              variant="outline"
              className="mt-4 text-lime-800 border-lime-800"
            >
              إضافة مادة جديدة
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-right table-fixed border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-700 text-xs font-bold uppercase">
                  <th className="p-4 w-20 text-center">#</th>
                  <th className="p-4 w-3/5">اسم المادة الدراسية</th>
                  <th className="p-4 w-1/5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSubjects.map((subject, index) => (
                  <tr key={subject.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 text-center font-semibold text-gray-400">
                      {index + 1}
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-lime-50 text-lime-800 rounded-lg">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span>{subject.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(subject)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(subject)}
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
              {editingSubject ? "تعديل المادة الدراسية" : "إضافة مادة دراسية جديدة"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              أدخل الاسم المعتمد للمادة الدراسية في الخطة الأكاديمية
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="subjectName">
                اسم المادة <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subjectName"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="مثال: الرياضيات، اللغة الإنجليزية، الكيمياء"
                required
              />
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-lime-800 hover:bg-lime-900 text-white"
              >
                {isSubmitting
                  ? "جاري الحفظ..."
                  : editingSubject
                  ? "تحديث المادة"
                  : "إضافة المادة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">
              تأكيد حذف المادة
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              هل أنت متأكد من رغبتك في حذف المادة{" "}
              <span className="font-bold text-gray-900">"{deleteTarget?.name}"</span>؟ سيؤثر هذا
              على المناهج وتوزيع الحصص المرتبطة بها.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
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
