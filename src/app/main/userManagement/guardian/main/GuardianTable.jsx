"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getGuardians, deleteGuardian, getRelationTypes } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Edit, Plus, Search } from "lucide-react";

export default function GuardianTable() {
  const [guardians, setGuardians] = useState([]);
  const [relationTypes, setRelationTypes] = useState([]);
  const [selectedRelation, setSelectedRelation] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
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
      const [guardiansData, relationsData] = await Promise.all([
        getGuardians().catch(() => []),
        getRelationTypes().catch(() => []),
      ]);
      setGuardians(guardiansData || []);
      setRelationTypes(relationsData || []);
    } catch (err) {
      console.error("فشل جلب أولياء الأمور:", err);
      setError("فشل في تحميل بيانات أولياء الأمور");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredGuardians = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return guardians.filter((g) => {
      const matchesSearch =
        !q ||
        g.userName?.toLowerCase().includes(q) ||
        g.email?.toLowerCase().includes(q) ||
        g.phone?.includes(q) ||
        g.secondryPhone?.includes(q) ||
        g.address?.toLowerCase().includes(q);

      const relationName = g.relationType?.name || g.relationName || "";
      const matchesRelation =
        selectedRelation === "ALL" ||
        relationName === selectedRelation ||
        String(g.relationTypeId) === selectedRelation;

      const isAct =
        g.isActive === true ||
        g.isActive === 1 ||
        g.isActive === "1" ||
        g.isActive === "true" ||
        g.status === "نشط";
      const matchesStatus =
        selectedStatus === "ALL" ||
        (selectedStatus === "ACTIVE" && isAct) ||
        (selectedStatus === "INACTIVE" && !isAct);

      return matchesSearch && matchesRelation && matchesStatus;
    });
  }, [guardians, searchQuery, selectedRelation, selectedStatus]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteGuardian(deleteTarget.id);
      setGuardians((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("فشل حذف ولي الأمر:", err);
      alert(err instanceof Error ? err.message : "فشل في حذف ولي الأمر");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderIsActive = (isActive) => {
    const isActivated =
      isActive === true ||
      isActive === 1 ||
      isActive === "1" ||
      isActive === "true" ||
      isActive === "مفعل";

    return (
      <span
        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
          isActivated
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {isActivated ? "نشط" : "معطل"}
      </span>
    );
  };

  return (
    <div dir="rtl" className="mt-6">
      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        {/* رأس الجدول */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h5 className="font-sans text-xl font-semibold text-gray-900 border-r-4 border-lime-700 pr-3">
                جدول أولياء الأمور
              </h5>
              <p className="text-sm text-gray-500 mt-1">
                إدارة بيانات أولياء الأمور، صلات القرابة وأرقام الاتصال
              </p>
            </div>
            <Link href="/main/userManagement/guardian/edit">
              <Button className="w-full sm:w-auto bg-lime-800 hover:bg-lime-900 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                إضافة ولي أمر جديد
              </Button>
            </Link>
          </div>

          {/* شريط الفلترة والبحث */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم أو الهاتف أو البريد..."
                className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-700"
              />
            </div>

            <div>
              <Select value={selectedRelation} onValueChange={setSelectedRelation}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="تصفية بصلة القرابة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">كافة صلات القرابة</SelectItem>
                  {relationTypes.map((r) => (
                    <SelectItem key={r.id} value={r.name || String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="حالة الحساب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">كافة الحالات</SelectItem>
                  <SelectItem value="ACTIVE">الحسابات النشطة فقط</SelectItem>
                  <SelectItem value="INACTIVE">الحسابات المعطلة فقط</SelectItem>
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
              <span className="mr-3 text-gray-600">جاري تحميل بيانات أولياء الأمور...</span>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">
              <p>{error}</p>
              <Button onClick={loadData} variant="outline" className="mt-3">
                إعادة المحاولة
              </Button>
            </div>
          ) : filteredGuardians.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base font-medium">لا يوجد أولياء أمور يطابقون خيارات البحث</p>
              <Link href="/main/userManagement/guardian/edit" className="inline-block mt-3">
                <Button variant="outline" className="text-lime-800 border-lime-800">
                  إضافة ولي أمر جديد
                </Button>
              </Link>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-right table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-700 text-xs font-bold uppercase">
                    <th className="p-3 w-1/4">ولي الأمر / البريد</th>
                    <th className="p-3 w-1/5">الهاتف</th>
                    <th className="p-3 w-1/6 hidden sm:table-cell">صلة القرابة</th>
                    <th className="p-3 w-1/4 hidden md:table-cell">العنوان</th>
                    <th className="p-3 w-20 text-center">الحالة</th>
                    <th className="p-3 w-20 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredGuardians.map((guardian) => {
                    const relationText =
                      guardian.relationType?.name ||
                      guardian.relationName ||
                      "ولي أمر";
                    return (
                      <tr key={guardian.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="p-3 truncate">
                          <div className="font-bold text-gray-900 truncate">
                            {guardian.userName}
                          </div>
                          <div className="text-xs text-gray-500 truncate" dir="ltr">
                            {guardian.email || "-"}
                          </div>
                        </td>
                        <td className="p-3 text-xs text-gray-600" dir="ltr">
                          <div>{guardian.phone || "-"}</div>
                          {guardian.secondryPhone && (
                            <div className="text-gray-400 text-[11px]">{guardian.secondryPhone}</div>
                          )}
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                            {relationText}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600 text-xs truncate hidden md:table-cell">
                          {guardian.address || "-"}
                        </td>
                        <td className="p-3 text-center">
                          {renderIsActive(guardian.isActive)}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              title="تعديل"
                              onClick={() => {
                                const encoded = encodeURIComponent(JSON.stringify(guardian));
                                router.push(
                                  `/main/userManagement/guardian/edit?id=${guardian.id}&data=${encoded}`
                                );
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              title="حذف"
                              onClick={() => setDeleteTarget(guardian)}
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
              تأكيد حذف ولي الأمر
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              هل أنت متأكد من رغبتك في حذف ولي الأمر{" "}
              <span className="font-bold text-gray-900">
                "{deleteTarget?.userName}"
              </span>
              ؟ هذا الإجراء قد يؤثر على حسابات الطلاب المرتبطين به.
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