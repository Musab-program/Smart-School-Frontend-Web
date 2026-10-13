"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  getAssignments,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  getSubmittedAssignments,
  addSubmittedAssignment,
  updateSubmittedAssignment,
  deleteSubmittedAssignment,
  getSubjectDetails,
  getSubjects,
  getGrades,
  getStudents,
} from "@/lib/api";
import { Assignment, SubmittedAssignment } from "@/types/assessment";
import { SubjectDetail, Subject } from "@/types/subject";
import { Grade } from "@/types/grade";
import { Student } from "@/types/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  FileCheck,
  Calendar,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<SubmittedAssignment[]>([]);
  const [subjectDetails, setSubjectDetails] = useState<SubjectDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [activeTab, setActiveTab] = useState<"assignments" | "submissions">("assignments");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modal 1: Add/Edit Assignment
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subjectDetailId: "",
    lastDate: new Date().toISOString().split("T")[0],
  });
  const [isAssignmentSubmitting, setIsAssignmentSubmitting] = useState(false);

  // Modal 2: Submit & Grade Assignment
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<SubmittedAssignment | null>(null);
  const [submissionForm, setSubmissionForm] = useState({
    assignmentId: "",
    studentId: "",
    mark: 10,
    notes: "عمل ممتاز ومتقن",
  });
  const [isSubmissionSubmitting, setIsSubmissionSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "assignment" | "submission";
    id: number;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [
        assignmentsData,
        submissionsData,
        detailsData,
        subjectsData,
        gradesData,
        studentsData,
      ] = await Promise.all([
        getAssignments().catch(() => []),
        getSubmittedAssignments().catch(() => []),
        getSubjectDetails().catch(() => []),
        getSubjects().catch(() => []),
        getGrades().catch(() => []),
        getStudents().catch(() => []),
      ]);

      setAssignments(assignmentsData || []);
      setSubmissions(submissionsData || []);
      setSubjectDetails(detailsData || []);
      setSubjects(subjectsData || []);
      setGrades(gradesData || []);
      setStudents(studentsData || []);
    } catch (err) {
      console.error("فشل جلب الواجبات:", err);
      setError("فشل في تحميل بيانات الواجبات المدرسية وتسليمات الطلاب");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const studentsMap = useMemo(() => {
    const map = new Map<number, string>();
    students.forEach((st) => st.id && map.set(st.id, st.userName));
    return map;
  }, [students]);

  const assignmentsMap = useMemo(() => {
    const map = new Map<number, string>();
    assignments.forEach((a) => a.id && map.set(a.id, a.title));
    return map;
  }, [assignments]);

  const subjectDetailNameMap = useMemo(() => {
    const map = new Map<number, { subjectName: string; gradeName: string }>();
    subjectDetails.forEach((sd) => {
      if (sd.id) {
        map.set(sd.id, {
          subjectName: sd.subjectName || subjectsMap.get(sd.subjectId) || `مادة ${sd.subjectId}`,
          gradeName: sd.gradeName || gradesMap.get(sd.gradeId) || `صف ${sd.gradeId}`,
        });
      }
    });
    return map;
  }, [subjectDetails, subjectsMap, gradesMap]);

  // Filtered lists
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      const sd = subjectDetailNameMap.get(a.subjectDetailId);
      const subjectName = sd?.subjectName || "";

      return !q || a.title.toLowerCase().includes(q) || subjectName.toLowerCase().includes(q);
    });
  }, [assignments, searchQuery, subjectDetailNameMap]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const studentName = studentsMap.get(s.studentId) || "";
      const assignmentTitle = assignmentsMap.get(s.assignmentId) || "";

      return !q || studentName.toLowerCase().includes(q) || assignmentTitle.toLowerCase().includes(q);
    });
  }, [submissions, searchQuery, studentsMap, assignmentsMap]);

  // Handlers
  const openAddAssignmentModal = () => {
    setEditingAssignment(null);
    setAssignmentForm({
      title: "",
      subjectDetailId: subjectDetails[0]?.id ? String(subjectDetails[0].id) : "",
      lastDate: new Date().toISOString().split("T")[0],
    });
    setIsAssignmentModalOpen(true);
  };

  const openEditAssignmentModal = (item: Assignment) => {
    setEditingAssignment(item);
    setAssignmentForm({
      title: item.title,
      subjectDetailId: String(item.subjectDetailId),
      lastDate: item.lastDate ? item.lastDate.split("T")[0] : new Date().toISOString().split("T")[0],
    });
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentForm.title.trim() || !assignmentForm.subjectDetailId) return;

    try {
      setIsAssignmentSubmitting(true);
      const payload = {
        title: assignmentForm.title.trim(),
        subjectDetailId: Number(assignmentForm.subjectDetailId),
        lastDate: new Date(assignmentForm.lastDate).toISOString(),
      };

      if (editingAssignment && editingAssignment.id) {
        await updateAssignment({ ...payload, id: editingAssignment.id });
      } else {
        await addAssignment(payload);
      }
      setIsAssignmentModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("فشل حفظ الواجب:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الواجب");
    } finally {
      setIsAssignmentSubmitting(false);
    }
  };

  const openAddSubmissionModal = () => {
    setEditingSubmission(null);
    setSubmissionForm({
      assignmentId: assignments[0]?.id ? String(assignments[0].id) : "",
      studentId: students[0]?.id ? String(students[0].id) : "",
      mark: 10,
      notes: "إجابة كاملة وصحيحة",
    });
    setIsSubmissionModalOpen(true);
  };

  const handleSubmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionForm.assignmentId || !submissionForm.studentId) return;

    try {
      setIsSubmissionSubmitting(true);
      const payload = {
        assignmentId: Number(submissionForm.assignmentId),
        studentId: Number(submissionForm.studentId),
        mark: Number(submissionForm.mark),
        notes: submissionForm.notes,
        filePath: "homework-solution.pdf",
      };

      if (editingSubmission && editingSubmission.id) {
        await updateSubmittedAssignment({ ...payload, id: editingSubmission.id });
      } else {
        await addSubmittedAssignment(payload);
      }
      setIsSubmissionModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("فشل تسجيل تسليم الواجب:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل تسليم الواجب");
    } finally {
      setIsSubmissionSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      if (deleteTarget.type === "assignment") {
        await deleteAssignment(deleteTarget.id);
      } else {
        await deleteSubmittedAssignment(deleteTarget.id);
      }
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error("فشل الحذف:", err);
      alert("فشل تنفيذ عملية الحذف");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/50 space-y-6" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-r-4 border-lime-700 pr-3">
            إدارة الواجبات والتكاليف المدرسية
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            نشر التكليفات والواجبات للطلاب، متابعة مواعيد التسليم، ورصد درجات التقييم
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={openAddSubmissionModal}
            variant="outline"
            className="border-blue-700 text-blue-800 hover:bg-blue-50"
          >
            تسليم وتقييم واجب
          </Button>
          <Button
            onClick={openAddAssignmentModal}
            className="bg-lime-800 hover:bg-lime-900 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة واجب جديد
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">إجمالي الواجبات المنشورة</div>
            <div className="text-2xl font-bold text-lime-800 mt-1">{assignments.length}</div>
            <div className="text-xs text-gray-400 mt-1">تكاليف على مستوى الفصول</div>
          </div>
          <div className="p-3 bg-lime-100 rounded-lg text-lime-800">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">التسليمات المكتملة</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{submissions.length}</div>
            <div className="text-xs text-gray-400 mt-1">واجبات مصححة ومقيمة</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">نسبة الإنجاز الطلابي</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {assignments.length > 0
                ? `${Math.round((submissions.length / (assignments.length * Math.max(students.length, 1))) * 100)}%`
                : "100%"}
            </div>
            <div className="text-xs text-gray-400 mt-1">معدل التفاعل الإجمالي</div>
          </div>
          <div className="p-3 bg-green-100 rounded-lg text-green-600">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* التبويبات وشريط البحث */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              activeTab === "assignments"
                ? "bg-white text-lime-800 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            قائمة الواجبات ({filteredAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              activeTab === "submissions"
                ? "bg-white text-blue-800 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            تسليمات وتقييمات الطلاب ({filteredSubmissions.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالعنوان أو المادة أو الطالب..."
            className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-700"
          />
        </div>
      </div>

      {/* الجدول النشط */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-lime-700 animate-spin" />
            <span className="mr-3 text-gray-600">جاري تحميل بيانات الواجبات...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
            <Button onClick={loadData} variant="outline" className="mt-3">
              إعادة المحاولة
            </Button>
          </div>
        ) : activeTab === "assignments" ? (
          /* جدول الواجبات */
          filteredAssignments.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <CheckSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-base font-semibold">لا توجد واجبات منشورة مطابقة</p>
              <Button
                onClick={openAddAssignmentModal}
                variant="outline"
                className="mt-4 text-lime-800 border-lime-800"
              >
                إنشاء أول واجب
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-right table-fixed border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-700 text-xs font-bold uppercase">
                    <th className="p-3 w-1/3">عنوان الواجب</th>
                    <th className="p-3 w-1/4">المادة والصف</th>
                    <th className="p-3 w-1/5">آخر موعد للتسليم</th>
                    <th className="p-3 w-20 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredAssignments.map((asg) => {
                    const sd = subjectDetailNameMap.get(asg.subjectDetailId);
                    const lastDateFormatted = asg.lastDate
                      ? new Date(asg.lastDate).toLocaleDateString("ar-EG")
                      : "-";

                    return (
                      <tr key={asg.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3 font-bold text-gray-900 truncate">{asg.title}</td>
                        <td className="p-3 truncate">
                          <span className="font-semibold text-lime-800">{sd?.subjectName || "-"}</span>
                          <span className="text-xs text-gray-400 mr-2">({sd?.gradeName || "-"})</span>
                        </td>
                        <td className="p-3 text-xs text-gray-600 font-medium">{lastDateFormatted}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditAssignmentModal(asg)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                asg.id &&
                                setDeleteTarget({
                                  type: "assignment",
                                  id: asg.id,
                                  title: asg.title,
                                })
                              }
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          )
        ) : (
          /* جدول التسليمات */
          filteredSubmissions.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FileCheck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-base font-semibold">لا توجد تسليمات واجبات مسجلة</p>
              <Button
                onClick={openAddSubmissionModal}
                variant="outline"
                className="mt-4 text-blue-800 border-blue-800"
              >
                تسليم أول واجب
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-right table-fixed border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-700 text-xs font-bold uppercase">
                    <th className="p-3 w-1/4">اسم الطالب</th>
                    <th className="p-3 w-1/3">الواجب المدرسي</th>
                    <th className="p-3 w-20 text-center">الدرجة</th>
                    <th className="p-3 w-1/4 hidden sm:table-cell">ملاحظات المعلم</th>
                    <th className="p-3 w-20 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredSubmissions.map((sub) => {
                    const studentName = studentsMap.get(sub.studentId) || `طالب ${sub.studentId}`;
                    const assignmentTitle =
                      assignmentsMap.get(sub.assignmentId) || `واجب ${sub.assignmentId}`;

                    return (
                      <tr key={sub.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3 font-bold text-gray-900 truncate">{studentName}</td>
                        <td className="p-3 font-medium text-gray-700 truncate">{assignmentTitle}</td>
                        <td className="p-3 text-center font-extrabold text-blue-600">
                          {sub.mark || 0} / 10
                        </td>
                        <td className="p-3 text-xs text-gray-500 truncate hidden sm:table-cell">
                          {sub.notes || "-"}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() =>
                              sub.id &&
                              setDeleteTarget({
                                type: "submission",
                                id: sub.id,
                                title: `تسليم: ${studentName}`,
                              })
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف التسليم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* نافذة إضافة/تعديل واجب */}
      <Dialog open={isAssignmentModalOpen} onOpenChange={setIsAssignmentModalOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 border-r-4 border-lime-700 pr-2">
              {editingAssignment ? "تعديل بيانات الواجب" : "إنشاء تكليف / واجب جديد"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              أدخل عنوان التكليف وحدد المادة وتاريخ انتهاء التسليم
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignmentSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>عنوان التكليف أو الواجب</Label>
              <Input
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                placeholder="مثال: حل تدريبات درس المعادلات الخطية ص 45"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>المادة والصف الدراسي</Label>
              <Select
                value={assignmentForm.subjectDetailId}
                onValueChange={(val) => setAssignmentForm({ ...assignmentForm, subjectDetailId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المادة والصف" />
                </SelectTrigger>
                <SelectContent>
                  {subjectDetails.map((sd) => {
                    const info = subjectDetailNameMap.get(sd.id || 0);
                    return (
                      <SelectItem key={sd.id} value={String(sd.id)}>
                        {info?.subjectName} ({info?.gradeName})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>آخر موعد لقبول التسليم</Label>
              <Input
                type="date"
                value={assignmentForm.lastDate}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, lastDate: e.target.value })}
                required
              />
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignmentModalOpen(false)}
                disabled={isAssignmentSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isAssignmentSubmitting}
                className="bg-lime-800 hover:bg-lime-900 text-white"
              >
                {isAssignmentSubmitting ? "جاري الحفظ..." : editingAssignment ? "تعديل الواجب" : "نشر الواجب"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة تسليم وتقييم واجب */}
      <Dialog open={isSubmissionModalOpen} onOpenChange={setIsSubmissionModalOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 border-r-4 border-blue-700 pr-2">
              تسليم وتقييم واجب طالب
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              اختر الواجب والطالب ورصد الدرجة المستحقة مع التغذية الراجعة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmissionSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>الواجب المستهدف</Label>
              <Select
                value={submissionForm.assignmentId}
                onValueChange={(val) => setSubmissionForm({ ...submissionForm, assignmentId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الواجب" />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الطالب المسلم</Label>
              <Select
                value={submissionForm.studentId}
                onValueChange={(val) => setSubmissionForm({ ...submissionForm, studentId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الطالب" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((st) => (
                    <SelectItem key={st.id} value={String(st.id)}>
                      {st.userName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الدرجة الممنوحة (من 10)</Label>
              <Input
                type="number"
                min={0}
                max={10}
                value={submissionForm.mark}
                onChange={(e) => setSubmissionForm({ ...submissionForm, mark: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>ملاحظات المعلم / التغذية الراجعة</Label>
              <Input
                value={submissionForm.notes}
                onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                placeholder="مثال: إجابة ممتازة وخط مرتب"
              />
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSubmissionModalOpen(false)}
                disabled={isSubmissionSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmissionSubmitting}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                {isSubmissionSubmitting ? "جاري الحفظ..." : "حفظ التقييم والتسليم"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">تأكيد عملية الحذف</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              هل أنت متأكد من رغبتك في حذف <span className="font-bold text-gray-900">"{deleteTarget?.title}"</span>؟
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
