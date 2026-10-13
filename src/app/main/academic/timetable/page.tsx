"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  getTimeTables,
  addTimeTable,
  updateTimeTable,
  deleteTimeTable,
  getGrades,
  getGroups,
  getSubjectDetails,
  getSubjects,
  getTeacher,
} from "@/lib/api";
import { TimeTableEntry, DAYS_OF_WEEK } from "@/types/timetable";
import { Grade } from "@/types/grade";
import { Group } from "@/types/group";
import { SubjectDetail, Subject } from "@/types/subject";
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
  Calendar,
  Clock,
  Layers,
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Filter,
  Grid3X3,
  List,
  Users,
  BookOpen,
} from "lucide-react";

const STANDARD_PERIODS = [
  { period: 1, startTime: "08:00", endTime: "08:45", label: "الحصة الأولى" },
  { period: 2, startTime: "08:45", endTime: "09:30", label: "الحصة الثانية" },
  { period: 3, startTime: "09:45", endTime: "10:30", label: "الحصة الثالثة" },
  { period: 4, startTime: "10:30", endTime: "11:15", label: "الحصة الرابعة" },
  { period: 5, startTime: "11:30", endTime: "12:15", label: "الحصة الخامسة" },
  { period: 6, startTime: "12:15", endTime: "13:00", label: "الحصة السادسة" },
  { period: 7, startTime: "13:00", endTime: "13:45", label: "الحصة السابعة" },
];

export default function TimetablePage() {
  const [timetables, setTimetables] = useState<TimeTableEntry[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjectDetails, setSubjectDetails] = useState<SubjectDetail[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & View Mode
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("ALL");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("ALL");
  const [selectedDay, setSelectedDay] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Dialogs
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimeTableEntry | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TimeTableEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    groupId: 0,
    subjectDetailId: 0,
    teacherId: 0,
    dayOfWeek: "الأحد",
    periodIndex: 0, // Quick period select
    startTime: "08:00",
    endTime: "08:45",
  });

  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ttRes, gRes, grpRes, sdRes, sRes, tRes] = await Promise.all([
        getTimeTables().catch(() => []),
        getGrades().catch(() => []),
        getGroups().catch(() => []),
        getSubjectDetails().catch(() => []),
        getSubjects().catch(() => []),
        getTeacher().catch(() => []),
      ]);

      setTimetables(ttRes);
      setGrades(gRes);
      setGroups(grpRes);
      setSubjectDetails(sdRes);
      setSubjects(sRes);
      setTeachers(tRes);
    } catch (err: any) {
      setError(err?.message || "فشل تحميل بيانات الجدول المدرسي");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Maps for lookups
  const subjectMap = useMemo(() => {
    const map = new Map<number, string>();
    subjects.forEach((s) => {
      if (s.id) map.set(s.id, s.name);
    });
    return map;
  }, [subjects]);

  const subjectDetailMap = useMemo(() => {
    const map = new Map<number, { name: string; gradeId: number }>();
    subjectDetails.forEach((sd) => {
      if (sd.id) {
        const subName = subjectMap.get(sd.subjectId) || `مادة #${sd.subjectId}`;
        map.set(sd.id, { name: subName, gradeId: sd.gradeId });
      }
    });
    return map;
  }, [subjectDetails, subjectMap]);

  const groupMap = useMemo(() => {
    const map = new Map<number, { name: string; gradeId: number }>();
    groups.forEach((g) => {
      if (g.id) map.set(g.id, { name: g.name, gradeId: g.gradeId });
    });
    return map;
  }, [groups]);

  const gradeMap = useMemo(() => {
    const map = new Map<number, string>();
    grades.forEach((g) => {
      if (g.id) map.set(g.id, g.name);
    });
    return map;
  }, [grades]);

  const teacherMap = useMemo(() => {
    const map = new Map<number, string>();
    teachers.forEach((t) => {
      if (t.id) map.set(t.id, t.userName || `معلم #${t.id}`);
    });
    return map;
  }, [teachers]);

  // Enriched timetable records
  const enrichedTimetables = useMemo(() => {
    return timetables.map((item) => {
      const grp = groupMap.get(item.groupId);
      const subDet = subjectDetailMap.get(item.subjectDetailId);
      const gradeId = grp?.gradeId || subDet?.gradeId || 0;
      const gradeName = gradeMap.get(gradeId) || "غير محدد";

      return {
        ...item,
        groupName: grp?.name || `شعبة #${item.groupId}`,
        gradeId,
        gradeName,
        subjectName: subDet?.name || `مادة #${item.subjectDetailId}`,
        teacherName: teacherMap.get(item.teacherId) || `معلم #${item.teacherId}`,
      };
    });
  }, [timetables, groupMap, subjectDetailMap, gradeMap, teacherMap]);

  // Filter groups depending on chosen grade
  const availableGroupsForFilter = useMemo(() => {
    if (selectedGradeId === "ALL") return groups;
    return groups.filter((g) => g.gradeId === Number(selectedGradeId));
  }, [groups, selectedGradeId]);

  // Filtered timetable entries
  const filteredTimetables = useMemo(() => {
    return enrichedTimetables.filter((item) => {
      if (selectedGradeId !== "ALL" && item.gradeId !== Number(selectedGradeId)) {
        return false;
      }
      if (selectedGroupId !== "ALL" && item.groupId !== Number(selectedGroupId)) {
        return false;
      }
      if (selectedDay !== "ALL" && item.dayOfWeek !== selectedDay) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSub = item.subjectName?.toLowerCase().includes(q);
        const matchesTeacher = item.teacherName?.toLowerCase().includes(q);
        const matchesGroup = item.groupName?.toLowerCase().includes(q);
        if (!matchesSub && !matchesTeacher && !matchesGroup) return false;
      }
      return true;
    });
  }, [enrichedTimetables, selectedGradeId, selectedGroupId, selectedDay, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const totalPeriods = timetables.length;
    const activeGroupsCount = new Set(timetables.map((t) => t.groupId)).size;
    const activeTeachersCount = new Set(timetables.map((t) => t.teacherId)).size;
    return { totalPeriods, activeGroupsCount, activeTeachersCount };
  }, [timetables]);

  // Format Time for display: helper
  const formatTimeDisplay = (timeVal: string) => {
    if (!timeVal) return "";
    if (timeVal.includes("T")) {
      const d = new Date(timeVal);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
      }
    }
    return timeVal;
  };

  // Convert time to ISO or backend accepted format
  const toBackendTimeString = (timeHHMM: string) => {
    const today = new Date();
    const [hours, minutes] = timeHHMM.split(":").map(Number);
    today.setHours(hours || 8, minutes || 0, 0, 0);
    return today.toISOString();
  };

  // Extract HH:mm from time string
  const extractHHMM = (timeStr: string) => {
    if (!timeStr) return "08:00";
    if (timeStr.includes("T")) {
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) {
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
      }
    }
    return timeStr.slice(0, 5);
  };

  // Open Upsert Modal
  const handleOpenUpsert = (item?: TimeTableEntry) => {
    if (item) {
      setEditingItem(item);
      const startHHMM = extractHHMM(item.startTime);
      const endHHMM = extractHHMM(item.endTime);
      const pIdx = STANDARD_PERIODS.findIndex((p) => p.startTime === startHHMM);

      setFormData({
        groupId: item.groupId,
        subjectDetailId: item.subjectDetailId,
        teacherId: item.teacherId,
        dayOfWeek: item.dayOfWeek,
        periodIndex: pIdx >= 0 ? pIdx : 0,
        startTime: startHHMM,
        endTime: endHHMM,
      });
    } else {
      setEditingItem(null);
      const defaultGroup = availableGroupsForFilter[0]?.id || groups[0]?.id || 0;
      const defaultSubDet = subjectDetails[0]?.id || 0;
      const defaultTeacher = teachers[0]?.id || 0;
      const defaultP = STANDARD_PERIODS[0];

      setFormData({
        groupId: defaultGroup,
        subjectDetailId: defaultSubDet,
        teacherId: defaultTeacher,
        dayOfWeek: selectedDay !== "ALL" ? selectedDay : "الأحد",
        periodIndex: 0,
        startTime: defaultP.startTime,
        endTime: defaultP.endTime,
      });
    }
    setIsUpsertOpen(true);
  };

  // Period preset change handler
  const handlePeriodChange = (idxStr: string) => {
    const idx = Number(idxStr);
    const p = STANDARD_PERIODS[idx];
    if (p) {
      setFormData((prev) => ({
        ...prev,
        periodIndex: idx,
        startTime: p.startTime,
        endTime: p.endTime,
      }));
    }
  };

  // Save (Create or Update)
  const handleSubmitUpsert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groupId || !formData.subjectDetailId || !formData.teacherId) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        groupId: formData.groupId,
        subjectDetailId: formData.subjectDetailId,
        teacherId: formData.teacherId,
        dayOfWeek: formData.dayOfWeek,
        startTime: toBackendTimeString(formData.startTime),
        endTime: toBackendTimeString(formData.endTime),
      };

      if (editingItem?.id) {
        await updateTimeTable({
          id: editingItem.id,
          ...payload,
        });
        showToast("تم تحديث الحصة الدراسية بنجاح", "success");
      } else {
        await addTimeTable(payload);
        showToast("تمت إضافة الحصة الدراسية إلى الجدول بنجاح", "success");
      }

      setIsUpsertOpen(false);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || "حدث خطأ أثناء حفظ الحصة الدراسية", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;
    setIsSubmitting(true);
    try {
      await deleteTimeTable(itemToDelete.id);
      showToast("تم حذف الحصة الدراسية من الجدول", "success");
      setIsDeleteOpen(false);
      setItemToDelete(null);
      await loadData();
    } catch (err: any) {
      showToast(err?.message || "حدث خطأ أثناء حذف الحصة الدراسية", "error");
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
            <Calendar className="h-7 w-7 text-primary" />
            جدول الحصص الأسبوعي
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            إدارة وتوزيع الحصص الدراسية والشعب التعليمية ومتابعة جداول المعلمين
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg bg-card p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-1.5 h-8 text-xs"
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              عرض الشبكة
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-1.5 h-8 text-xs"
            >
              <List className="h-3.5 w-3.5" />
              عرض القائمة
            </Button>
          </div>
          <Button
            onClick={() => handleOpenUpsert()}
            className="gap-2 bg-primary text-primary-foreground shadow-sm"
          >
            <Plus className="h-4 w-4" />
            إضافة حصة دراسية
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalPeriods}</div>
            <div className="text-xs text-muted-foreground">إجمالي الحصص المجدولة</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.activeGroupsCount}</div>
            <div className="text-xs text-muted-foreground">الشعب المشمولة بالجدول</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.activeTeachersCount}</div>
            <div className="text-xs text-muted-foreground">المعلمين المكلفين بالحظر</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Filter className="h-4 w-4" />
          تصفية الجدول
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                <SelectItem value="ALL">كل الشعب والمجموعات</SelectItem>
                {availableGroupsForFilter.map((grp) => (
                  <SelectItem key={grp.id} value={String(grp.id)}>
                    {grp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1 block">اليوم</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="كل الأيام" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">كل أيام الأسبوع</SelectItem>
                {DAYS_OF_WEEK.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1 block">بحث سريع</Label>
            <div className="relative">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالمادة، المعلم..."
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
            جاري تحميل الجدول الأسبوعي...
          </span>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={loadData} className="mt-3">
            إعادة المحاولة
          </Button>
        </div>
      ) : filteredTimetables.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-base font-semibold">لا توجد حصص مجدولة تطابق معايير البحث</p>
          <p className="text-xs mt-1 text-muted-foreground/80">
            يمكنك إضافة حصة جديدة أو تغيير خيارات التصفية
          </p>
          <Button
            size="sm"
            onClick={() => handleOpenUpsert()}
            className="mt-4 gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة حصة دراسية الآن
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* Weekly Grid View */
        <div className="space-y-6">
          {(selectedDay === "ALL" ? DAYS_OF_WEEK : [selectedDay]).map((day) => {
            const dayEntries = filteredTimetables.filter((t) => t.dayOfWeek === day);
            if (selectedDay === "ALL" && dayEntries.length === 0) return null;

            return (
              <div key={day} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <h2 className="text-base font-bold text-foreground">{day}</h2>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {dayEntries.length} حصص
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 gap-1 text-primary"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, dayOfWeek: day }));
                      handleOpenUpsert();
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    إضافة حصة ليوم {day}
                  </Button>
                </div>

                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {dayEntries.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-lg border bg-background p-3.5 shadow-xs hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-primary" />
                            {item.subjectName}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {item.gradeName} - {item.groupName}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
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
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-medium text-foreground">{item.teacherName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary font-medium bg-primary/5 px-2 py-0.5 rounded">
                          <Clock className="h-3 w-3" />
                          <span>
                            {extractHHMM(item.startTime)} - {extractHHMM(item.endTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact Table View */
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-muted/50 border-b text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">اليوم</th>
                  <th className="p-3">الوقت</th>
                  <th className="p-3">المادة الدراسية</th>
                  <th className="p-3">الصف والشعبة</th>
                  <th className="p-3">المعلم</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTimetables.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-semibold text-foreground">{item.dayOfWeek}</td>
                    <td className="p-3 text-primary font-medium">
                      {extractHHMM(item.startTime)} - {extractHHMM(item.endTime)}
                    </td>
                    <td className="p-3 font-medium text-foreground">{item.subjectName}</td>
                    <td className="p-3 text-muted-foreground">
                      {item.gradeName} - {item.groupName}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upsert Modal */}
      <Dialog open={isUpsertOpen} onOpenChange={setIsUpsertOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <form onSubmit={handleSubmitUpsert}>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "تعديل الحصة الدراسية" : "إضافة حصة دراسية جديدة"}
              </DialogTitle>
              <DialogDescription>
                حدد تفاصيل الحصة، الشعبة، المادة، والمعلم المكلف
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 text-xs">
              {/* Day selection */}
              <div>
                <Label className="text-xs mb-1 block">يوم الأسبوع *</Label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(val) => setFormData({ ...formData, dayOfWeek: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="اختر اليوم" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Group selection */}
              <div>
                <Label className="text-xs mb-1 block">الشعبة / المجموعة *</Label>
                <Select
                  value={formData.groupId ? String(formData.groupId) : ""}
                  onValueChange={(val) =>
                    setFormData({ ...formData, groupId: Number(val) })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="اختر الشعبة" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((grp) => {
                      const grName = gradeMap.get(grp.gradeId);
                      return (
                        <SelectItem key={grp.id} value={String(grp.id)}>
                          {grp.name} {grName ? `(${grName})` : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Detail */}
              <div>
                <Label className="text-xs mb-1 block">المادة الدراسية *</Label>
                <Select
                  value={formData.subjectDetailId ? String(formData.subjectDetailId) : ""}
                  onValueChange={(val) =>
                    setFormData({ ...formData, subjectDetailId: Number(val) })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectDetails.map((sd) => {
                      const subName = subjectMap.get(sd.subjectId) || `مادة #${sd.subjectId}`;
                      const grName = gradeMap.get(sd.gradeId) || "";
                      return (
                        <SelectItem key={sd.id} value={String(sd.id)}>
                          {subName} {grName ? `(${grName})` : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Teacher */}
              <div>
                <Label className="text-xs mb-1 block">المعلم المكلف *</Label>
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

              {/* Quick Period Picker */}
              <div>
                <Label className="text-xs mb-1 block">فترة الحصة المعتادة</Label>
                <Select
                  value={String(formData.periodIndex)}
                  onValueChange={handlePeriodChange}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="اختر فترة" />
                  </SelectTrigger>
                  <SelectContent>
                    {STANDARD_PERIODS.map((p, idx) => (
                      <SelectItem key={p.period} value={String(idx)}>
                        {p.label} ({p.startTime} - {p.endTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom time slots */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs mb-1 block">وقت البدء</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">وقت الانتهاء</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="h-9 text-xs"
                    required
                  />
                </div>
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
                  "حفظ التعديلات"
                ) : (
                  "إضافة الحصة"
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
            <DialogTitle className="text-rose-600">حذف الحصة الدراسية</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف حصة{" "}
              <strong className="text-foreground">{itemToDelete?.subjectName}</strong> ليوم{" "}
              <strong className="text-foreground">{itemToDelete?.dayOfWeek}</strong> الخاصة بشعبة{" "}
              <strong className="text-foreground">{itemToDelete?.groupName}</strong>؟
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
