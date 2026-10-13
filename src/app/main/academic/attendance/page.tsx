"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  getStudentAttendances,
  addStudentAttendance,
  updateStudentAttendance,
  deleteStudentAttendance,
  getStudents,
  getGrades,
  getGroups,
  getTeacher,
} from "@/lib/api";
import { StudentAttendance, ATTENDANCE_STATUSES } from "@/types/attendance";
import { Student } from "@/types/student";
import { Grade } from "@/types/grade";
import { Group } from "@/types/group";
import { Teacher } from "@/types/teacher";
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
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Filter,
  Calendar,
  Save,
} from "lucide-react";

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab: "daily" for taking class attendance, "history" for viewing all logs
  const [activeTab, setActiveTab] = useState<"daily" | "history">("daily");

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedGradeId, setSelectedGradeId] = useState<string>("ALL");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Daily Mode: Local status state for taking class attendance in bulk
  // studentId -> { status: string, attendanceId?: number }
  const [dailyRoster, setDailyRoster] = useState<
    Record<number, { status: string; id?: number; teacherId?: number }>
  >({});
  const [selectedRecorderTeacherId, setSelectedRecorderTeacherId] = useState<number>(0);
  const [isSavingDaily, setIsSavingDaily] = useState(false);

  // Modal State for Single Record Upsert / Delete
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudentAttendance | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<StudentAttendance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState({
    studentId: 0,
    teacherId: 0,
    attendanceDate: new Date().toISOString().split("T")[0],
    status: "حاضر",
  });

  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [attRes, stuRes, grRes, grpRes, tRes] = await Promise.all([
        getStudentAttendances().catch(() => []),
        getStudents().catch(() => []),
        getGrades().catch(() => []),
        getGroups().catch(() => []),
        getTeacher().catch(() => []),
      ]);

      setAttendances(attRes);
      setStudents(stuRes);
      setGrades(grRes);
      setGroups(grpRes);
      setTeachers(tRes);

      if (tRes.length > 0 && selectedRecorderTeacherId === 0) {
        setSelectedRecorderTeacherId(tRes[0].id || 0);
      }
    } catch (err: any) {
      setError(err?.message || "فشل تحميل بيانات الحضور والغياب");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lookups
  const gradeMap = useMemo(() => {
    const map = new Map<number, string>();
    grades.forEach((g) => {
      if (g.id) map.set(g.id, g.name);
    });
    return map;
  }, [grades]);

  const groupMap = useMemo(() => {
    const map = new Map<number, { name: string; gradeId: number }>();
    groups.forEach((g) => {
      if (g.id) map.set(g.id, { name: g.name, gradeId: g.gradeId });
    });
    return map;
  }, [groups]);

  const studentMap = useMemo(() => {
    const map = new Map<number, Student>();
    students.forEach((s) => {
      if (s.id) map.set(s.id, s);
    });
    return map;
  }, [students]);

  const teacherMap = useMemo(() => {
    const map = new Map<number, string>();
    teachers.forEach((t) => {
      if (t.id) map.set(t.id, t.userName || `معلم #${t.id}`);
    });
    return map;
  }, [teachers]);

  // Enriched Attendances
  const enrichedAttendances = useMemo(() => {
    return attendances.map((att) => {
      const stu = studentMap.get(att.studentId);
      const grp = stu ? groupMap.get(stu.groupId) : undefined;
      const gradeName = grp ? gradeMap.get(grp.gradeId) : "غير محدد";

      return {
        ...att,
        studentName: stu?.userName || `طالب #${att.studentId}`,
        groupName: grp?.name || "غير محدد",
        groupId: stu?.groupId,
        gradeName,
        teacherName: teacherMap.get(att.teacherId) || `معلم #${att.teacherId}`,
      };
    });
  }, [attendances, studentMap, groupMap, gradeMap, teacherMap]);

  // Synchronize Daily Roster whenever selectedDate or Attendances change
  useEffect(() => {
    const map: Record<number, { status: string; id?: number; teacherId?: number }> = {};
    const dayStr = selectedDate;

    attendances.forEach((att) => {
      const attDay = att.attendanceDate ? att.attendanceDate.split("T")[0] : "";
      if (attDay === dayStr) {
        map[att.studentId] = {
          status: att.status,
          id: att.id,
          teacherId: att.teacherId,
        };
      }
    });

    setDailyRoster(map);
  }, [selectedDate, attendances]);

  // Filter groups according to chosen grade
  const availableGroups = useMemo(() => {
    if (selectedGradeId === "ALL") return groups;
    return groups.filter((g) => g.gradeId === Number(selectedGradeId));
  }, [groups, selectedGradeId]);

  // Students eligible for daily attendance list based on filters
  const dailyEligibleStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedGroupId !== "ALL" && s.groupId !== Number(selectedGroupId)) {
        return false;
      }
      if (selectedGradeId !== "ALL") {
        const grp = groupMap.get(s.groupId);
        if (!grp || grp.gradeId !== Number(selectedGradeId)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!s.userName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [students, selectedGradeId, selectedGroupId, searchQuery, groupMap]);

  // Filtered History Records
  const filteredHistory = useMemo(() => {
    return enrichedAttendances.filter((att) => {
      if (selectedDate && att.attendanceDate) {
        const attDay = att.attendanceDate.split("T")[0];
        if (attDay !== selectedDate) return false;
      }
      if (selectedStatusFilter !== "ALL" && att.status !== selectedStatusFilter) {
        return false;
      }
      if (selectedGroupId !== "ALL" && att.groupId !== Number(selectedGroupId)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesStu = att.studentName?.toLowerCase().includes(q);
        const matchesTea = att.teacherName?.toLowerCase().includes(q);
        if (!matchesStu && !matchesTea) return false;
      }
      return true;
    });
  }, [enrichedAttendances, selectedDate, selectedStatusFilter, selectedGroupId, searchQuery]);

  // Overall Today Stats
  const todayStats = useMemo(() => {
    const dayEntries = enrichedAttendances.filter((a) =>
      a.attendanceDate ? a.attendanceDate.startsWith(selectedDate) : false
    );
    const present = dayEntries.filter((a) => a.status === "حاضر").length;
    const absent = dayEntries.filter((a) => a.status === "غائب").length;
    const late = dayEntries.filter((a) => a.status === "متأخر").length;
    const excused = dayEntries.filter((a) => a.status === "مستأذن").length;
    const totalRecorded = dayEntries.length;

    return { present, absent, late, excused, totalRecorded };
  }, [enrichedAttendances, selectedDate]);

  // Handle single student status switch in daily roster
  const handleStudentStatusChange = (studentId: number, status: string) => {
    setDailyRoster((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        status,
        teacherId: selectedRecorderTeacherId,
      },
    }));
  };

  // Mark all filtered students with a certain status
  const handleMarkAllStatus = (status: string) => {
    setDailyRoster((prev) => {
      const updated = { ...prev };
      dailyEligibleStudents.forEach((s) => {
        if (s.id) {
          updated[s.id] = {
            ...(updated[s.id] || {}),
            status,
            teacherId: selectedRecorderTeacherId,
          };
        }
      });
      return updated;
    });
  };

  // Save Daily Batch Attendance
  const handleSaveDailyRoster = async () => {
    if (!selectedRecorderTeacherId) {
      showToast("يرجى تحديد المعلم المسجل للحضور", "error");
      return;
    }

    setIsSavingDaily(true);
    try {
      const isoDate = `${selectedDate}T08:00:00.000Z`;
      let savedCount = 0;

      for (const student of dailyEligibleStudents) {
        if (!student.id) continue;
        const entry = dailyRoster[student.id];
        if (!entry?.status) continue;

        if (entry.id) {
          // Update existing
          await updateStudentAttendance({
            id: entry.id,
            studentId: student.id,
            teacherId: selectedRecorderTeacherId,
            attendanceDate: isoDate,
            status: entry.status,
          });
        } else {
          // Add new
          await addStudentAttendance({
            studentId: student.id,
            teacherId: selectedRecorderTeacherId,
            attendanceDate: isoDate,
            status: entry.status,
          });
        }
        savedCount++;
      }

      showToast(`تم حفظ وتحديث كشف الحضور لـ (${savedCount}) طالب بنجاح`, "success");
      await loadData();
    } catch (err: any) {
      showToast(err?.message || "حدث خطأ أثناء حفظ كشف الحضور", "error");
    } finally {
      setIsSavingDaily(false);
    }
  };

  // Open single upsert modal
  const handleOpenUpsert = (item?: StudentAttendance) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        studentId: item.studentId,
        teacherId: item.teacherId,
        attendanceDate: item.attendanceDate
          ? item.attendanceDate.split("T")[0]
          : selectedDate,
        status: item.status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        studentId: students[0]?.id || 0,
        teacherId: selectedRecorderTeacherId || teachers[0]?.id || 0,
        attendanceDate: selectedDate,
        status: "حاضر",
      });
    }
    setIsUpsertOpen(true);
  };

  // Submit single upsert modal
  const handleSubmitUpsert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.teacherId) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const isoDate = `${formData.attendanceDate}T08:00:00.000Z`;
      if (editingItem?.id) {
        await updateStudentAttendance({
          id: editingItem.id,
          studentId: formData.studentId,
          teacherId: formData.teacherId,
          attendanceDate: isoDate,
          status: formData.status,
        });
        showToast("تم تحديث سجل الحضور بنجاح", "success");
      } else {
        await addStudentAttendance({
          studentId: formData.studentId,
          teacherId: formData.teacherId,
          attendanceDate: isoDate,
          status: formData.status,
        });
        showToast("تم تسجيل حضور الطالب بنجاح", "success");
      }
      setIsUpsertOpen(false);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || "فشل حفظ سجل الحضور", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;
    setIsSubmitting(true);
    try {
      await deleteStudentAttendance(itemToDelete.id);
      showToast("تم حذف سجل الحضور بنجاح", "success");
      setIsDeleteOpen(false);
      setItemToDelete(null);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || "فشل حذف سجل الحضور", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 left-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg transition-all text-white ${
            toastMessage.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CheckSquare className="h-7 w-7 text-primary" />
            حضور وغياب الطلاب
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            تسجيل الحضور اليومي، رصد التأخير والاستئذان، ومتابعة سجلات الطلاب
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg bg-card p-0.5">
            <Button
              variant={activeTab === "daily" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("daily")}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Calendar className="h-3.5 w-3.5" />
              رصد الحضور اليومي
            </Button>
            <Button
              variant={activeTab === "history" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("history")}
              className="gap-1.5 h-8 text-xs font-semibold"
            >
              <Users className="h-3.5 w-3.5" />
              سجل الحضور الكامل
            </Button>
          </div>
          <Button
            onClick={() => handleOpenUpsert()}
            className="gap-2 bg-primary text-primary-foreground shadow-sm"
          >
            <Plus className="h-4 w-4" />
            تسجيل فردي
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-700">{todayStats.present}</div>
            <div className="text-xs text-muted-foreground">الطلاب الحاضرين اليوم</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl">
            <UserX className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-rose-700">{todayStats.absent}</div>
            <div className="text-xs text-muted-foreground">الغياب اليوم</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-700">{todayStats.late}</div>
            <div className="text-xs text-muted-foreground">المتأخرين اليوم</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-blue-700">{todayStats.totalRecorded}</div>
            <div className="text-xs text-muted-foreground">إجمالي المرصود لليوم</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Filter className="h-4 w-4" />
          خيارات التصفية والتاريخ
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-xs mb-1 block">تاريخ اليوم</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div>
            <Label className="text-xs mb-1 block">الصف الدراسي</Label>
            <Select
              value={selectedGradeId}
              onValueChange={(val) => {
                setSelectedGradeId(val);
                setSelectedGroupId("ALL");
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="كل الصفوف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">كل الصفوف الدراسية</SelectItem>
                {grades.map((g) => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1 block">الشعبة / المجموعة</Label>
            <Select
              value={selectedGroupId}
              onValueChange={(val) => setSelectedGroupId(val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="كل الشعب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">كل الشعب</SelectItem>
                {availableGroups.map((grp) => (
                  <SelectItem key={grp.id} value={String(grp.id)}>
                    {grp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1 block">بحث باسم الطالب</Label>
            <div className="relative">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن اسم طالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8 h-9 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-card rounded-xl border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-3 text-sm text-muted-foreground font-medium">
            جاري تحميل سجلات الحضور...
          </span>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={loadData} className="mt-3">
            إعادة المحاولة
          </Button>
        </div>
      ) : activeTab === "daily" ? (
        /* DAILY BATCH ATTENDANCE VIEW */
        <div className="rounded-xl border bg-card shadow-sm space-y-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3">
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold text-foreground">
                كشف الرصد اليومي ({dailyEligibleStudents.length} طالب)
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-emerald-700 hover:bg-emerald-50"
                  onClick={() => handleMarkAllStatus("حاضر")}
                >
                  تعيين الكل حاضر
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-rose-700 hover:bg-rose-50"
                  onClick={() => handleMarkAllStatus("غائب")}
                >
                  تعيين الكل غائب
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground shrink-0">المعلم المسجل:</Label>
                <Select
                  value={String(selectedRecorderTeacherId)}
                  onValueChange={(val) => setSelectedRecorderTeacherId(Number(val))}
                >
                  <SelectTrigger className="h-8 text-xs w-[160px]">
                    <SelectValue placeholder="اختر المعلم" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.userName || `معلم #${t.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                size="sm"
                className="gap-1.5 h-8 text-xs bg-primary text-primary-foreground font-semibold"
                onClick={handleSaveDailyRoster}
                disabled={isSavingDaily}
              >
                {isSavingDaily ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                حفظ كشف الحضور
              </Button>
            </div>
          </div>

          {dailyEligibleStudents.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">لا يوجد طلاب مطابقين للفلاتر المحددة</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-muted/50 border-b text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">اسم الطالب</th>
                    <th className="p-3">الصف والشعبة</th>
                    <th className="p-3">حالة الحضور</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dailyEligibleStudents.map((student, idx) => {
                    const currentStatus =
                      dailyRoster[student.id!]?.status || "حاضر";
                    const grp = groupMap.get(student.groupId);
                    const gradeName = grp ? gradeMap.get(grp.gradeId) : "غير محدد";

                    return (
                      <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-muted-foreground">{idx + 1}</td>
                        <td className="p-3 font-semibold text-foreground">
                          {student.userName}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {gradeName} - {grp?.name || "بدون شعبة"}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            {ATTENDANCE_STATUSES.map((st) => (
                              <button
                                key={st.value}
                                type="button"
                                onClick={() =>
                                  handleStudentStatusChange(student.id!, st.value)
                                }
                                className={`px-2.5 py-1 rounded-md border text-xs font-semibold transition-all ${
                                  currentStatus === st.value
                                    ? st.color + " shadow-xs ring-1 ring-primary/20 scale-105"
                                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                                }`}
                              >
                                {st.label}
                              </button>
                            ))}
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
      ) : (
        /* FULL HISTORY LOGS VIEW */
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">
              سجلات الحضور المسجلة ({filteredHistory.length} سجل)
            </span>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">تصفية الحالة:</Label>
              <Select
                value={selectedStatusFilter}
                onValueChange={setSelectedStatusFilter}
              >
                <SelectTrigger className="h-7 text-xs w-[120px]">
                  <SelectValue placeholder="كل الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">كل الحالات</SelectItem>
                  {ATTENDANCE_STATUSES.map((st) => (
                    <SelectItem key={st.value} value={st.value}>
                      {st.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">لا توجد سجلات حضور مسجلة لهذا التاريخ</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-muted/50 border-b text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">اسم الطالب</th>
                    <th className="p-3">الصف والشعبة</th>
                    <th className="p-3">حالة الحضور</th>
                    <th className="p-3">المعلم المسجل</th>
                    <th className="p-3 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredHistory.map((item) => {
                    const badge = ATTENDANCE_STATUSES.find(
                      (s) => s.value === item.status
                    );
                    const formattedDate = item.attendanceDate
                      ? item.attendanceDate.split("T")[0]
                      : "-";

                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-muted-foreground font-mono">
                          {formattedDate}
                        </td>
                        <td className="p-3 font-semibold text-foreground">
                          {item.studentName}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {item.gradeName} - {item.groupName}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-semibold ${
                              badge ? badge.color : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{item.teacherName}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-primary"
                              onClick={() => handleOpenUpsert(item)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-rose-600"
                              onClick={() => {
                                setItemToDelete(item);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
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
      )}

      {/* Upsert Single Modal */}
      <Dialog open={isUpsertOpen} onOpenChange={setIsUpsertOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleSubmitUpsert}>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "تعديل سجل الحضور" : "تسجيل حضور طالب فردي"}
              </DialogTitle>
              <DialogDescription>
                تحديد حالة حضور الطالب لليوم المحدد
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              <div>
                <Label className="text-xs mb-1 block">تاريخ الحضور *</Label>
                <Input
                  type="date"
                  value={formData.attendanceDate}
                  onChange={(e) =>
                    setFormData({ ...formData, attendanceDate: e.target.value })
                  }
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs mb-1 block">الطالب *</Label>
                <Select
                  value={formData.studentId ? String(formData.studentId) : ""}
                  onValueChange={(val) =>
                    setFormData({ ...formData, studentId: Number(val) })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="اختر الطالب" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((stu) => {
                      const grp = groupMap.get(stu.groupId);
                      return (
                        <SelectItem key={stu.id} value={String(stu.id)}>
                          {stu.userName} {grp ? `(${grp.name})` : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-1 block">حالة الحضور *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    {ATTENDANCE_STATUSES.map((st) => (
                      <SelectItem key={st.value} value={st.value}>
                        {st.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-1 block">المعلم المسجل *</Label>
                <Select
                  value={formData.teacherId ? String(formData.teacherId) : ""}
                  onValueChange={(val) =>
                    setFormData({ ...formData, teacherId: Number(val) })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="اختر المعلم" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.userName || `معلم #${t.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUpsertOpen(false)}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingItem ? (
                  "حفظ التعديل"
                ) : (
                  "تسجيل الحضور"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-rose-600">حذف سجل الحضور</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف سجل حضور الطالب{" "}
              <strong className="text-foreground">{itemToDelete?.studentName}</strong>؟
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "نعم، حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
