"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  getSubjectDetails,
  addSubjectDetail,
  updateSubjectDetail,
  deleteSubjectDetail,
  getSubjects,
  getGrades,
  getTeachers,
  getTeachingSubjects,
  addTeachingSubject,
  deleteTeachingSubject,
} from "@/lib/api";
import { SubjectDetail, Subject, TeachingSubject } from "@/types/subject";
import { Grade } from "@/types/grade";
import { Teacher } from "@/types/teacher";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Layers,
  BookOpen,
  GraduationCap,
  Plus,
  Trash2,
  Search,
  Loader2,
  UserCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function CurriculumPage() {
  const [subjectDetails, setSubjectDetails] = useState<SubjectDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachingSubjects, setTeachingSubjects] = useState<TeachingSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("ALL");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("ALL");

  // Modal 1: Link Subject to Grade (SubjectDetail)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailForm, setDetailForm] = useState({
    gradeId: "",
    subjectId: "",
    isActive: true,
  });
  const [isDetailSubmitting, setIsDetailSubmitting] = useState(false);

  // Modal 2: Assign Teacher to SubjectDetail (TeachingSubject)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetDetail, setAssignTargetDetail] = useState<SubjectDetail | null>(null);
  const [assignForm, setAssignForm] = useState({
    teacherId: "",
    semster: 1,
  });
  const [isAssignSubmitting, setIsAssignSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<SubjectDetail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [
        detailsData,
        subjectsData,
        gradesData,
        teachersData,
        teachingData,
      ] = await Promise.all([
        getSubjectDetails().catch(() => []),
        getSubjects().catch(() => []),
        getGrades().catch(() => []),
        getTeachers().catch(() => []),
        getTeachingSubjects().catch(() => []),
      ]);

      setSubjectDetails(detailsData || []);
      setSubjects(subjectsData || []);
      setGrades(gradesData || []);
      setTeachers(teachersData || []);
      setTeachingSubjects(teachingData || []);
    } catch (err) {
      console.error("فشل جلب بيانات الخطة الدراسية:", err);
      setError("فشل في تحميل بيانات الخطة الدراسية وتوزيع الحصص");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Lookup maps
  const subjectsMap = useMemo(() => {
    const map = new Map<number, string>();
    subjects.forEach((s) => s.id && map.set(s.id, s.name));
    return map;
  }, [subjects]);

  const gradesMap = useMemo(() => {
    const map = new Map<number, string>();
    grades.forEach((g) => g.id && map.set(g.id, g.name));
    return map;
  }, [grades]);

  const teachersMap = useMemo(() => {
    const map = new Map<number, string>();
    teachers.forEach((t) => t.id && map.set(t.id, t.userName));
    return map;
  }, [teachers]);

  // Teaching subjects grouped by SubjectDetailId
  const teachingByDetailMap = useMemo(() => {
    const map = new Map<number, TeachingSubject[]>();
    teachingSubjects.forEach((ts) => {
      const list = map.get(ts.subjectDetailId) || [];
      list.push(ts);
      map.set(ts.subjectDetailId, list);
    });
    return map;
  }, [teachingSubjects]);

  const openAddDetailModal = () => {
    setDetailForm({
      gradeId: grades[0]?.id ? String(grades[0].id) : "",
      subjectId: subjects[0]?.id ? String(subjects[0].id) : "",
      isActive: true,
    });
    setIsDetailModalOpen(true);
  };

  const openAssignTeacherModal = (detail: SubjectDetail) => {
    setAssignTargetDetail(detail);
    setAssignForm({
      teacherId: teachers[0]?.id ? String(teachers[0].id) : "",
      semster: 1,
    });
    setIsAssignModalOpen(true);
  };

  const handleAddDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailForm.gradeId || !detailForm.subjectId) return;

    try {
      setIsDetailSubmitting(true);
      await addSubjectDetail({
        gradeId: Number(detailForm.gradeId),
        subjectId: Number(detailForm.subjectId),
        isActive: detailForm.isActive,
      });
      setIsDetailModalOpen(false);
      await loadAllData();
    } catch (err) {
      console.error("فشل حفظ تفصيل المادة:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء الربط بالصف");
    } finally {
      setIsDetailSubmitting(false);
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTargetDetail || !assignTargetDetail.id || !assignForm.teacherId) return;

    try {
      setIsAssignSubmitting(true);
      await addTeachingSubject({
        teacherId: Number(assignForm.teacherId),
        subjectDetailId: assignTargetDetail.id,
        semster: Number(assignForm.semster),
        academicYear: new Date().toISOString(),
      });
      setIsAssignModalOpen(false);
      await loadAllData();
    } catch (err) {
      console.error("فشل إسناد المادة للمعلم:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء إسناد المعلم");
    } finally {
      setIsAssignSubmitting(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: number) => {
    if (!confirm("هل أنت متأكد من رغبتك في إلغاء إسناد هذه المادة للمعلم؟")) return;
    try {
      await deleteTeachingSubject(assignmentId);
      await loadAllData();
    } catch (err) {
      console.error("فشل إلغاء الإسناد:", err);
      alert("فشل في إلغاء إسناد المادة");
    }
  };

  const handleDeleteDetail = async () => {
    if (!deleteTarget || !deleteTarget.id) return;
    try {
      setIsDeleting(true);
      await deleteSubjectDetail(deleteTarget.id);
      setDeleteTarget(null);
      await loadAllData();
    } catch (err) {
      console.error("فشل حذف ارتباط المادة:", err);
      alert("فشل حذف ارتباط المادة");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered List
  const filteredDetails = useMemo(() => {
    return subjectDetails.filter((d) => {
      const sName = d.subjectName || subjectsMap.get(d.subjectId) || "";
      const gName = d.gradeName || gradesMap.get(d.gradeId) || "";

      const matchesSearch =
        !searchQuery.trim() ||
        sName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        gName.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesGrade =
        selectedGradeFilter === "ALL" ||
        String(d.gradeId) === selectedGradeFilter;

      const matchesSubject =
        selectedSubjectFilter === "ALL" ||
        String(d.subjectId) === selectedSubjectFilter;

      return matchesSearch && matchesGrade && matchesSubject;
    });
  }, [
    subjectDetails,
    searchQuery,
    selectedGradeFilter,
    selectedSubjectFilter,
    subjectsMap,
    gradesMap,
  ]);

  return (
    <div className="p-6 min-h-screen bg-gray-50/50 space-y-6" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-r-4 border-lime-700 pr-3">
            الخطة الدراسية وتوزيع الحصص
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            ربط المواد بالصفوف الدراسية وإسناد الحصص الدراسية للمعلمين المعتمدين
          </p>
        </div>
        <Button
          onClick={openAddDetailModal}
          className="bg-lime-800 hover:bg-lime-900 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة مادة إلى صف دراسي
        </Button>
      </div>

      {/* بطاقات إحصائيات */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">إجمالي حصص الخطة</div>
            <div className="text-2xl font-bold text-lime-800 mt-1">{subjectDetails.length}</div>
            <div className="text-xs text-gray-400 mt-1">مادة موزعة على الصفوف</div>
          </div>
          <div className="p-3 bg-lime-100 rounded-lg text-lime-800">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">إسنادات المعلمين المكتملة</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{teachingSubjects.length}</div>
            <div className="text-xs text-gray-400 mt-1">حصة مسندة لمعلم</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">الصفوف المغطاة بالخطة</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {new Set(subjectDetails.map((d) => d.gradeId)).size} / {grades.length}
            </div>
            <div className="text-xs text-gray-400 mt-1">صف دراسي جاهز</div>
          </div>
          <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* شريط البحث والفلترة المتدرجة */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالمادة أو الصف..."
            className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-700"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="w-full sm:w-52">
            <Select value={selectedGradeFilter} onValueChange={setSelectedGradeFilter}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="تصفية حسب الصف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">كافة الصفوف الدراسية</SelectItem>
                {grades.map((g) => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-52">
            <Select value={selectedSubjectFilter} onValueChange={setSelectedSubjectFilter}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="تصفية حسب المادة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">كافة المواد الدراسية</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* جدول تفاصيل الخطة الدراسية وتوزيع المعلمين */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-lime-700 animate-spin" />
            <span className="mr-3 text-gray-600">جاري تحميل بيانات الخطة الدراسية...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
            <Button onClick={loadAllData} variant="outline" className="mt-3">
              إعادة المحاولة
            </Button>
          </div>
        ) : filteredDetails.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Layers className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-base font-semibold">لا توجد مقررات دراسية مطابقة</p>
            <Button
              onClick={openAddDetailModal}
              variant="outline"
              className="mt-4 text-lime-800 border-lime-800"
            >
              إضافة أول مادة للخطة
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-right table-fixed border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-700 text-xs font-bold uppercase">
                  <th className="p-3 w-1/4">المادة الدراسية</th>
                  <th className="p-3 w-1/5">الصف الدراسي</th>
                  <th className="p-3 w-1/3">المعلمون المسندة لهم</th>
                  <th className="p-3 w-20 text-center">الحالة</th>
                  <th className="p-3 w-28 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredDetails.map((detail) => {
                  const subjectName =
                    detail.subjectName ||
                    subjectsMap.get(detail.subjectId) ||
                    `مادة ${detail.subjectId}`;
                  const gradeName =
                    detail.gradeName ||
                    gradesMap.get(detail.gradeId) ||
                    `صف ${detail.gradeId}`;
                  const assignments = detail.id
                    ? teachingByDetailMap.get(detail.id) || []
                    : [];

                  return (
                    <tr key={detail.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-3 font-bold text-gray-900 truncate">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-lime-700 shrink-0" />
                          <span className="truncate">{subjectName}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lime-50 text-lime-800 border border-lime-200">
                          {gradeName}
                        </span>
                      </td>
                      <td className="p-3">
                        {assignments.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {assignments.map((asg) => {
                              const teacherName =
                                asg.teacherName ||
                                teachersMap.get(asg.teacherId) ||
                                `معلم ${asg.teacherId}`;
                              return (
                                <span
                                  key={asg.id}
                                  className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-2 py-0.5 rounded-lg text-xs font-medium border border-blue-100"
                                >
                                  <span>{teacherName}</span>
                                  <button
                                    onClick={() => asg.id && handleRemoveAssignment(asg.id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="إلغاء الإسناد"
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">
                            لم يتم إسناد معلم بعد
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            detail.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {detail.isActive ? "نشط" : "معطل"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openAssignTeacherModal(detail)}
                            className="p-1.5 text-lime-800 hover:bg-lime-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 border border-lime-300"
                            title="إسناد معلم"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            إسناد
                          </button>
                          <button
                            onClick={() => setDeleteTarget(detail)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف من الخطة"
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

      {/* نافذة ربط مادة بصف دراسي */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 border-r-4 border-lime-700 pr-2">
              إضافة مادة إلى صف دراسي
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              اختر الصف الدراسي وحدد المادة المقررة له
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDetail} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>الصف الدراسي</Label>
              <Select
                value={detailForm.gradeId}
                onValueChange={(val) => setDetailForm({ ...detailForm, gradeId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الصف" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name} ({g.stage})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>المادة الدراسية</Label>
              <Select
                value={detailForm.subjectId}
                onValueChange={(val) => setDetailForm({ ...detailForm, subjectId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المادة" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDetailModalOpen(false)}
                disabled={isDetailSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isDetailSubmitting}
                className="bg-lime-800 hover:bg-lime-900 text-white"
              >
                {isDetailSubmitting ? "جاري الإضافة..." : "اعتماد المادة بالصف"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة إسناد المادة لمعلم */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 border-r-4 border-lime-700 pr-2">
              إسناد حصة لمدرس
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              المادة:{" "}
              <strong>
                {assignTargetDetail
                  ? subjectsMap.get(assignTargetDetail.subjectId)
                  : ""}
              </strong>{" "}
              - الصف:{" "}
              <strong>
                {assignTargetDetail
                  ? gradesMap.get(assignTargetDetail.gradeId)
                  : ""}
              </strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignTeacher} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>المعلم المرشح</Label>
              <Select
                value={assignForm.teacherId}
                onValueChange={(val) => setAssignForm({ ...assignForm, teacherId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المعلم" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.userName} ({t.phone || "معلم"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الفصل الدراسي</Label>
              <Select
                value={String(assignForm.semster)}
                onValueChange={(val) => setAssignForm({ ...assignForm, semster: Number(val) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفصل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">الفصل الدراسي الأول</SelectItem>
                  <SelectItem value="2">الفصل الدراسي الثاني</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignModalOpen(false)}
                disabled={isAssignSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isAssignSubmitting}
                className="bg-lime-800 hover:bg-lime-900 text-white"
              >
                {isAssignSubmitting ? "جاري الإسناد..." : "تأكيد إسناد الحصة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد حذف المادة من الخطة */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">
              تأكيد حذف المادة من الخطة
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              هل أنت متأكد من رغبتك في حذف هذا المقرر من الصف؟ سيؤدي ذلك لإلغاء جميع إسنادات المعلمين لهذه الحصة.
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
              onClick={handleDeleteDetail}
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
