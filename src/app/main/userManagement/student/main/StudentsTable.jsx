"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStudents, deleteStudent, getGroups, getGuardians, getGrades } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Edit, Plus, Search } from "lucide-react";

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState("ALL");
  const [selectedGroupId, setSelectedGroupId] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [studentsData, groupsData, guardiansData, gradesData] = await Promise.all([
        getStudents().catch(() => []),
        getGroups().catch(() => []),
        getGuardians().catch(() => []),
        getGrades().catch(() => []),
      ]);
      setStudents(studentsData || []);
      setGroups(groupsData || []);
      setGuardians(guardiansData || []);
      setGrades(gradesData || []);
    } catch (err) {
      console.error("خطأ في جلب بيانات الطلاب:", err);
      setError("فشل في تحميل بيانات الطلاب");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const groupsMap = useMemo(() => {
    const map = new Map();
    groups.forEach((g) => map.set(g.id, g));
    return map;
  }, [groups]);

  const guardiansMap = useMemo(() => {
    const map = new Map();
    guardians.forEach((g) => map.set(g.id, g.userName));
    return map;
  }, [guardians]);

  // الشعب المتاحة بناء على الصف المختار
  const availableGroups = useMemo(() => {
    if (selectedGradeId === "ALL") return groups;
    return groups.filter((g) => String(g.gradeId) === selectedGradeId);
  }, [groups, selectedGradeId]);

  const handleGradeChange = (val) => {
    setSelectedGradeId(val);
    setSelectedGroupId("ALL");
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const groupObj = groupsMap.get(s.groupId);
      const matchesSearch =
        !q ||
        s.userName?.toLowerCase().includes(q) ||
        s.userEmail?.toLowerCase().includes(q) ||
        s.userPhone?.includes(q) ||
        s.userAddress?.toLowerCase().includes(q);

      const matchesGrade =
        selectedGradeId === "ALL" ||
        (groupObj && String(groupObj.gradeId) === selectedGradeId);

      const matchesGroup =
        selectedGroupId === "ALL" ||
        String(s.groupId) === selectedGroupId;

      return matchesSearch && matchesGrade && matchesGroup;
    });
  }, [students, searchQuery, selectedGradeId, selectedGroupId, groupsMap]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteStudent(deleteTarget.id);
      setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("فشل حذف الطالب:", err);
      alert(err instanceof Error ? err.message : "فشل في حذف الطالب");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div dir="rtl" className="mt-6">
      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        {/* رأس الجدول */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h5 className="font-sans text-xl font-semibold text-gray-900 border-r-4 border-lime-700 pr-3">
                جدول الطلاب
              </h5>
              <p className="text-sm text-gray-500 mt-1">
                إدارة بيانات الطلاب، وتوزيعهم الأكاديمي حسب الصف والشعبة
              </p>
            </div>
            <Link href="/main/userManagement/student/edit">
              <Button className="w-full sm:w-auto bg-lime-800 hover:bg-lime-900 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                إضافة طالب جديد
              </Button>
            </Link>
          </div>

          {/* شريط الفلترة المتدرجة والبحث */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم أو البريد أو الهاتف..."
                className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-700"
              />
            </div>

            <div>
              <Select value={selectedGradeId} onValueChange={handleGradeChange}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="تصفية حسب الصف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">كافة الصفوف الدراسية</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={String(grade.id)}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="تصفية حسب الشعبة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">كافة الشعب</SelectItem>
                  {availableGroups.map((group) => (
                    <SelectItem key={group.id} value={String(group.id)}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* جسم الجدول المتجاوب بدون سكرول أفقي */}
        <div className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-lime-700 animate-spin" />
              <span className="mr-3 text-gray-600">جاري تحميل بيانات الطلاب...</span>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">
              <p>{error}</p>
              <Button onClick={loadData} variant="outline" className="mt-3">
                إعادة المحاولة
              </Button>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base font-medium">لا يوجد طلاب يطابقون خيارات البحث والفلترة</p>
              <Link href="/main/userManagement/student/edit" className="inline-block mt-3">
                <Button variant="outline" className="text-lime-800 border-lime-800">
                  إضافة طالب جديد
                </Button>
              </Link>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-right table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-700 text-xs font-bold uppercase">
                    <th className="p-3 w-1/4">اسم الطالب / البريد</th>
                    <th className="p-3 w-1/6 hidden md:table-cell">الهاتف</th>
                    <th className="p-3 w-1/6">ولي الأمر</th>
                    <th className="p-3 w-1/6 hidden sm:table-cell">الصف / الشعبة</th>
                    <th className="p-3 w-20 text-center">الحالة</th>
                    <th className="p-3 w-20 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredStudents.map((student) => {
                    const groupObj = groupsMap.get(student.groupId);
                    const groupName = student.groupName || groupObj?.name || "-";
                    const gradeName = groupObj?.gradeName || "";
                    const guardianName =
                      student.guardianName ||
                      guardiansMap.get(student.guardianId) ||
                      "-";
                    return (
                      <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="p-3 truncate">
                          <div className="font-bold text-gray-900 truncate">
                            {student.userName}
                          </div>
                          <div className="text-xs text-gray-500 truncate" dir="ltr">
                            {student.userEmail}
                          </div>
                        </td>
                        <td className="p-3 text-gray-600 text-xs hidden md:table-cell" dir="ltr">
                          {student.userPhone || "-"}
                        </td>
                        <td className="p-3 truncate">
                          <span className="font-medium text-gray-800 text-xs truncate block">
                            {guardianName}
                          </span>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <span className="inline-block bg-lime-50 text-lime-800 px-2 py-0.5 rounded text-xs font-semibold">
                            {gradeName ? `${gradeName} - ` : ""}{groupName}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                              student.isActiveUser
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.isActiveUser ? "نشط" : "معطل"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              title="تعديل"
                              onClick={() =>
                                router.push(
                                  `/main/userManagement/student/edit?id=${student.id}`
                                )
                              }
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              title="حذف"
                              onClick={() => setDeleteTarget(student)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>

      {/* نافذة تأكيد الحذف */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">
              تأكيد حذف الطالب
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              هل أنت متأكد من رغبتك في حذف الطالب{" "}
              <span className="font-bold text-gray-900">
                "{deleteTarget?.userName}"
              </span>
              ؟ هذا الإجراء لا يمكن التراجع عنه.
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
