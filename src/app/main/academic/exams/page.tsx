"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  getExams,
  addExam,
  updateExam,
  deleteExam,
  getExamTypes,
  addExamType,
  getResults,
  addResult,
  updateResult,
  deleteResult,
  getGroups,
  getSubjectDetails,
  getSubjects,
  getGrades,
  getStudents,
} from "@/lib/api";
import { Exam, ExamType, ExamResult } from "@/types/assessment";
import { Group } from "@/types/group";
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
  FileText,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Calendar,
  Clock,
  Award,
  Layers,
  CheckCircle,
  Users,
} from "lucide-react";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjectDetails, setSubjectDetails] = useState<SubjectDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [activeTab, setActiveTab] = useState<"exams" | "results" | "types">("exams");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("ALL");
  const [error, setError] = useState<string | null>(null);

  // Modal 1: Exam Schedule (Add/Edit)
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [examForm, setExamForm] = useState({
    subjectDetailId: "",
    groupId: "",
    examTypeId: "",
    examDate: new Date().toISOString().split("T")[0],
    limitTime: 60,
  });
  const [isExamSubmitting, setIsExamSubmitting] = useState(false);

  // Modal 2: Add Exam Type
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [isTypeSubmitting, setIsTypeSubmitting] = useState(false);

  // Modal 3: Record Student Result
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [resultForm, setResultForm] = useState({
    subjectDetailId: "",
    studentId: "",
    mark: 85,
    rate: "جيد جداً",
  });
  const [isResultSubmitting, setIsResultSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{ type: "exam" | "result"; id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [
        examsData,
        typesData,
        resultsData,
        groupsData,
        detailsData,
        subjectsData,
        gradesData,
        studentsData,
      ] = await Promise.all([
        getExams().catch(() => []),
        getExamTypes().catch(() => []),
        getResults().catch(() => []),
        getGroups().catch(() => []),
        getSubjectDetails().catch(() => []),
        getSubjects().catch(() => []),
        getGrades().catch(() => []),
        getStudents().catch(() => []),
      ]);

      setExams(examsData || []);
      setExamTypes(typesData || []);
      setResults(resultsData || []);
      setGroups(groupsData || []);
      setSubjectDetails(detailsData || []);
      setSubjects(subjectsData || []);
      setGrades(gradesData || []);
      setStudents(studentsData || []);
    } catch (err) {
      console.error("فشل جلب بيانات الاختبارات:", err);
      setError("فشل في تحميل بيانات الاختبارات والنتائج");
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

  const groupsMap = useMemo(() => {
    const map = new Map<number, string>();
    groups.forEach((g) => g.id && map.set(g.id, g.name));
    return map;
  }, [groups]);

  const examTypesMap = useMemo(() => {
    const map = new Map<number, string>();
    examTypes.forEach((t) => t.id && map.set(t.id, t.name));
    return map;
  }, [examTypes]);

  const studentsMap = useMemo(() => {
    const map = new Map<number, string>();
    students.forEach((st) => st.id && map.set(st.id, st.userName));
    return map;
  }, [students]);

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

  // Exams Filtered
  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const groupName = groupsMap.get(e.groupId) || "";
      const sd = subjectDetailNameMap.get(e.subjectDetailId);
      const subjectName = sd?.subjectName || "";
      const typeName = examTypesMap.get(e.examTypeId) || "";

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        groupName.toLowerCase().includes(q) ||
        subjectName.toLowerCase().includes(q) ||
        typeName.toLowerCase().includes(q);

      const matchesGroup =
        selectedGroupFilter === "ALL" || String(e.groupId) === selectedGroupFilter;

      return matchesSearch && matchesGroup;
    });
  }, [exams, searchQuery, selectedGroupFilter, groupsMap, subjectDetailNameMap, examTypesMap]);

  // Results Filtered
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const studentName = studentsMap.get(r.studentId) || "";
      const sd = subjectDetailNameMap.get(r.subjectDetailId);
      const subjectName = sd?.subjectName || "";

      const q = searchQuery.toLowerCase().trim();
      return !q || studentName.toLowerCase().includes(q) || subjectName.toLowerCase().includes(q);
    });
  }, [results, searchQuery, studentsMap, subjectDetailNameMap]);

  // Exam Handlers
  const openAddExamModal = () => {
    setEditingExam(null);
    setExamForm({
      subjectDetailId: subjectDetails[0]?.id ? String(subjectDetails[0].id) : "",
      groupId: groups[0]?.id ? String(groups[0].id) : "",
      examTypeId: examTypes[0]?.id ? String(examTypes[0].id) : "",
      examDate: new Date().toISOString().split("T")[0],
      limitTime: 60,
    });
    setIsExamModalOpen(true);
  };

  const openEditExamModal = (exam: Exam) => {
    setEditingExam(exam);
    setExamForm({
      subjectDetailId: String(exam.subjectDetailId),
      groupId: String(exam.groupId),
      examTypeId: String(exam.examTypeId),
      examDate: exam.examDate ? exam.examDate.split("T")[0] : new Date().toISOString().split("T")[0],
      limitTime: exam.limitTime || 60,
    });
    setIsExamModalOpen(true);
  };

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.subjectDetailId || !examForm.groupId || !examForm.examTypeId) return;

    try {
      setIsExamSubmitting(true);
      const payload = {
        subjectDetailId: Number(examForm.subjectDetailId),
        groupId: Number(examForm.groupId),
        examTypeId: Number(examForm.examTypeId),
        examDate: new Date(examForm.examDate).toISOString(),
        limitTime: Number(examForm.limitTime),
      };

      if (editingExam && editingExam.id) {
        await updateExam({ ...payload, id: editingExam.id });
      } else {
        await addExam(payload);
      }
      setIsExamModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("فشل حفظ الاختبار:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الاختبار");
    } finally {
      setIsExamSubmitting(false);
    }
  };

  // Exam Type Handler
  const handleAddTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;

    try {
      setIsTypeSubmitting(true);
      await addExamType({
        name: typeName.trim(),
        year: new Date().toISOString(),
      });
      setTypeName("");
      setIsTypeModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("فشل إضافة نوع الاختبار:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء إضافة نوع الاختبار");
    } finally {
      setIsTypeSubmitting(false);
    }
  };

  // Result Handlers
  const openAddResultModal = () => {
    setEditingResult(null);
    setResultForm({
      subjectDetailId: subjectDetails[0]?.id ? String(subjectDetails[0].id) : "",
      studentId: students[0]?.id ? String(students[0].id) : "",
      mark: 85,
      rate: "جيد جداً",
    });
    setIsResultModalOpen(true);
  };

  const handleResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultForm.subjectDetailId || !resultForm.studentId) return;

    try {
      setIsResultSubmitting(true);
      const markNum = Number(resultForm.mark);
      const rateVal =
        markNum >= 90 ? "ممتاز" : markNum >= 75 ? "جيد جداً" : markNum >= 50 ? "مقبول" : "راسب";

      const payload = {
        subjectDetailId: Number(resultForm.subjectDetailId),
        studentId: Number(resultForm.studentId),
        mark: markNum,
        rate: rateVal,
      };

      if (editingResult && editingResult.id) {
        await updateResult({ ...payload, id: editingResult.id });
      } else {
        await addResult(payload);
      }
      setIsResultModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("فشل رصد النتيجة:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء رصد النتيجة");
    } finally {
      setIsResultSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      if (deleteTarget.type === "exam") {
        await deleteExam(deleteTarget.id);
      } else {
        await deleteResult(deleteTarget.id);
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
            إدارة الاختبارات ورصد النتائج
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            جدولة مواعيد الامتحانات، وتحديد أنواع التقييم، ورصد درجات ونتائج الطلاب
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setIsTypeModalOpen(true)}
            variant="outline"
            className="border-lime-700 text-lime-800 hover:bg-lime-50"
          >
            نوع تقييم جديد
          </Button>
          <Button
            onClick={openAddResultModal}
            variant="outline"
            className="border-blue-700 text-blue-800 hover:bg-blue-50"
          >
            رصد درجة طالب
          </Button>
          <Button
            onClick={openAddExamModal}
            className="bg-lime-800 hover:bg-lime-900 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            جدولة اختبار جديد
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">إجمالي الاختبارات المجدولة</div>
            <div className="text-2xl font-bold text-lime-800 mt-1">{exams.length}</div>
            <div className="text-xs text-gray-400 mt-1">امتحانات رسمية وفصلية</div>
          </div>
          <div className="p-3 bg-lime-100 rounded-lg text-lime-800">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">النتائج المرصودة</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{results.length}</div>
            <div className="text-xs text-gray-400 mt-1">درجات تم اعتمادها</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-500">أنواع التقييم المعتمدة</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{examTypes.length}</div>
            <div className="text-xs text-gray-400 mt-1">نصفي، نهائي، أعمال سنة</div>
          </div>
          <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* شريط التنقل بين التبويبات والبحث والفلترة */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              activeTab === "exams" ? "bg-white text-lime-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            جدول الاختبارات ({filteredExams.length})
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              activeTab === "results" ? "bg-white text-blue-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            النتائج والدرجات ({filteredResults.length})
          </button>
          <button
            onClick={() => setActiveTab("types")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              activeTab === "types" ? "bg-white text-amber-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            أنواع التقييم ({examTypes.length})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالمادة أو الطالب أو الشعبة..."
              className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-700"
            />
          </div>

          {activeTab === "exams" && (
            <div className="w-full sm:w-48">
              <Select value={selectedGroupFilter} onValueChange={setSelectedGroupFilter}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="تصفية بالشعبة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">كافة الشعب</SelectItem>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* الجدول النشط بناء على التبويب */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-lime-700 animate-spin" />
            <span className="mr-3 text-gray-600">جاري تحميل بيانات التقييمات...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
            <Button onClick={loadData} variant="outline" className="mt-3">
              إعادة المحاولة
            </Button>
          </div>
        ) : activeTab === "exams" ? (
          /* تبويب جدول الاختبارات */
          filteredExams.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-base font-semibold">لا توجد اختبارات مجدولة مطابقة</p>
              <Button onClick={openAddExamModal} variant="outline" className="mt-4 text-lime-800 border-lime-800">
                جدولة أول اختبار
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-right table-fixed border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-700 text-xs font-bold uppercase">
                    <th className="p-3 w-1/4">المادة والصف</th>
                    <th className="p-3 w-1/5">الشعبة</th>
                    <th className="p-3 w-1/5">نوع الاختبار</th>
                    <th className="p-3 w-1/5">التاريخ والوقت</th>
                    <th className="p-3 w-20 text-center">المدة</th>
                    <th className="p-3 w-20 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredExams.map((exam) => {
                    const sd = subjectDetailNameMap.get(exam.subjectDetailId);
                    const groupName = groupsMap.get(exam.groupId) || `شعبة ${exam.groupId}`;
                    const typeName = examTypesMap.get(exam.examTypeId) || `نوع ${exam.examTypeId}`;
                    const dateFormatted = exam.examDate
                      ? new Date(exam.examDate).toLocaleDateString("ar-EG")
                      : "-";

                    return (
                      <tr key={exam.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3 truncate">
                          <div className="font-bold text-gray-900 truncate">
                            {sd?.subjectName || `مادة ${exam.subjectDetailId}`}
                          </div>
                          <div className="text-xs text-gray-500">{sd?.gradeName || "-"}</div>
                        </td>
                        <td className="p-3">
                          <span className="inline-block bg-lime-50 text-lime-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {groupName}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                            {typeName}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-gray-700 font-medium">{dateFormatted}</td>
                        <td className="p-3 text-center text-xs text-gray-600">{exam.limitTime} دقيقة</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditExamModal(exam)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                exam.id &&
                                setDeleteTarget({
                                  type: "exam",
                                  id: exam.id,
                                  name: `${sd?.subjectName || "الاختبار"} (${groupName})`,
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
        ) : activeTab === "results" ? (
          /* تبويب درجات ونتائج الطلاب */
          filteredResults.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Award className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-base font-semibold">لا توجد درجات مرصودة حالياً</p>
              <Button onClick={openAddResultModal} variant="outline" className="mt-4 text-blue-800 border-blue-800">
                رصد أول نتيجة
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-right table-fixed border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-700 text-xs font-bold uppercase">
                    <th className="p-3 w-1/3">اسم الطالب</th>
                    <th className="p-3 w-1/4">المادة والصف</th>
                    <th className="p-3 w-1/6 text-center">الدرجة المكتسبة</th>
                    <th className="p-3 w-1/6 text-center">التقدير</th>
                    <th className="p-3 w-20 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredResults.map((res) => {
                    const studentName = studentsMap.get(res.studentId) || `طالب ${res.studentId}`;
                    const sd = subjectDetailNameMap.get(res.subjectDetailId);

                    return (
                      <tr key={res.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3 font-bold text-gray-900 truncate">{studentName}</td>
                        <td className="p-3 truncate">
                          <span className="font-semibold text-lime-800">{sd?.subjectName || "-"}</span>
                          <span className="text-xs text-gray-400 mr-2">({sd?.gradeName || "-"})</span>
                        </td>
                        <td className="p-3 text-center font-extrabold text-blue-600 text-base">
                          {res.mark} / 100
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              res.mark >= 90
                                ? "bg-green-100 text-green-800"
                                : res.mark >= 75
                                ? "bg-blue-100 text-blue-800"
                                : res.mark >= 50
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {res.rate || (res.mark >= 50 ? "ناجح" : "راسب")}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() =>
                              res.id &&
                              setDeleteTarget({
                                type: "result",
                                id: res.id,
                                name: `نتيجة الطالب: ${studentName}`,
                              })
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف النتيجة"
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
        ) : (
          /* تبويب أنواع الاختبارات */
          <div className="w-full">
            <table className="w-full text-right table-fixed border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-700 text-xs font-bold uppercase">
                  <th className="p-3 w-16 text-center">#</th>
                  <th className="p-3 w-2/3">مسمى نوع الاختبار</th>
                  <th className="p-3 w-1/4">العام الدراسي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {examTypes.map((type, idx) => (
                  <tr key={type.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3 text-center text-gray-400 font-bold">{idx + 1}</td>
                    <td className="p-3 font-bold text-gray-900">{type.name}</td>
                    <td className="p-3 text-gray-600 text-xs">
                      {type.year ? new Date(type.year).getFullYear() : "2026"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* نافذة جدولة اختبار */}
      <Dialog open={isExamModalOpen} onOpenChange={setIsExamModalOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 border-r-4 border-lime-700 pr-2">
              {editingExam ? "تعديل موعد اختبار" : "جدولة اختبار جديد"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              حدد المادة الدراسية، الشعبة المستهدفة، ونوع الامتحان والوقت
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExamSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>المادة والصف الدراسي</Label>
              <Select
                value={examForm.subjectDetailId}
                onValueChange={(val) => setExamForm({ ...examForm, subjectDetailId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المادة" />
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
              <Label>الشعبة الدراسية المستهدفة</Label>
              <Select
                value={examForm.groupId}
                onValueChange={(val) => setExamForm({ ...examForm, groupId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الشعبة" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نوع الاختبار</Label>
              <Select
                value={examForm.examTypeId}
                onValueChange={(val) => setExamForm({ ...examForm, examTypeId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الاختبار" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>تاريخ الامتحان</Label>
                <Input
                  type="date"
                  value={examForm.examDate}
                  onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>المدة (بالدقائق)</Label>
                <Input
                  type="number"
                  min={15}
                  max={240}
                  value={examForm.limitTime}
                  onChange={(e) => setExamForm({ ...examForm, limitTime: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExamModalOpen(false)}
                disabled={isExamSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isExamSubmitting}
                className="bg-lime-800 hover:bg-lime-900 text-white"
              >
                {isExamSubmitting ? "جاري الحفظ..." : editingExam ? "تعديل الاختبار" : "تأكيد الجدولة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة إضافة نوع اختبار */}
      <Dialog open={isTypeModalOpen} onOpenChange={setIsTypeModalOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 border-r-4 border-lime-700 pr-2">
              إضافة نوع تقييم / اختبار
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              مثال: اختبار نصفي، امتحان نهاية الفصل، اختبار قصير، أعمال سنة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTypeSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>اسم نوع الاختبار</Label>
              <Input
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="مثال: الاختبار النصفي الأول"
                required
              />
            </div>
            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTypeModalOpen(false)}
                disabled={isTypeSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isTypeSubmitting}
                className="bg-lime-800 hover:bg-lime-900 text-white"
              >
                {isTypeSubmitting ? "جاري الإضافة..." : "حفظ النوع"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة رصد درجة طالب */}
      <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 border-r-4 border-blue-700 pr-2">
              رصد درجة طالب
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              اختر الطالب والمادة وسجل الدرجة المكتسبة (من 100)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResultSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>الطالب</Label>
              <Select
                value={resultForm.studentId}
                onValueChange={(val) => setResultForm({ ...resultForm, studentId: val })}
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
              <Label>المادة والصف</Label>
              <Select
                value={resultForm.subjectDetailId}
                onValueChange={(val) => setResultForm({ ...resultForm, subjectDetailId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المادة" />
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
              <Label>الدرجة المستحقة (0 - 100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={resultForm.mark}
                onChange={(e) => setResultForm({ ...resultForm, mark: Number(e.target.value) })}
                required
              />
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResultModalOpen(false)}
                disabled={isResultSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isResultSubmitting}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                {isResultSubmitting ? "جاري الرصد..." : "حفظ النتيجة"}
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
              هل أنت متأكد من رغبتك في حذف <span className="font-bold text-gray-900">"{deleteTarget?.name}"</span>؟
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
