"use client";

import React, { useState, useEffect } from "react";
import { getUsers, addUser, updateUser, deleteUser, getRoles } from "@/lib/api";
import { User } from "@/types/user";
import { Role } from "@/types/role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, ShieldCheck, Users, UserCheck, UserX } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<User>({
    userName: "",
    email: "",
    roleID: 1,
    phone: "",
    passwordInput: "",
    dateOfBirth: "1990-01-01",
    isActive: true,
    address: "",
    gender: "ذكر",
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [usersData, rolesData] = await Promise.all([
        getUsers(),
        getRoles().catch(() => []),
      ]);
      setUsers(usersData || []);
      setRoles(rolesData || []);
    } catch (err) {
      console.error("فشل جلب المستخدمين:", err);
      setError("فشل في تحميل بيانات المستخدمين");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const rolesMap = React.useMemo(() => {
    const map = new Map<number, string>();
    roles.forEach((r) => {
      const id = r.id || r.RoleId;
      const name = r.name || r.RoleName;
      if (id && name) map.set(id, name);
    });
    return map;
  }, [roles]);

  const openAddModal = () => {
    setEditingUser(null);
    setForm({
      userName: "",
      email: "",
      roleID: roles[0]?.id || roles[0]?.RoleId || 1,
      phone: "",
      passwordInput: "",
      dateOfBirth: "1990-01-01",
      isActive: true,
      address: "",
      gender: "ذكر",
    });
    setIsDialogOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      id: user.id || user.UserId,
      userName: user.userName,
      email: user.email,
      roleID: user.roleID || 1,
      phone: user.phone || "",
      passwordInput: "",
      dateOfBirth: user.dateOfBirth
        ? user.dateOfBirth.slice(0, 10)
        : "1990-01-01",
      isActive: user.isActive ?? true,
      address: user.address || "",
      gender: user.gender || "ذكر",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userName.trim() || !form.email.trim()) return;

    try {
      setIsSubmitting(true);
      const payload: User = {
        ...form,
        roleID: Number(form.roleID),
        dateOfBirth: new Date(form.dateOfBirth).toISOString(),
        passwordInput: form.passwordInput || undefined,
      };

      if (editingUser && (editingUser.id || editingUser.UserId)) {
        await updateUser(payload);
      } else {
        await addUser(payload);
      }
      setIsDialogOpen(false);
      await loadData();
    } catch (err) {
      console.error("فشل حفظ المستخدم:", err);
      alert(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ المستخدم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const id = deleteTarget?.id || deleteTarget?.UserId;
    if (!id) return;
    try {
      setIsDeleting(true);
      await deleteUser(id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error("فشل حذف المستخدم:", err);
      alert(err instanceof Error ? err.message : "فشل حذف المستخدم");
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = React.useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const inactive = total - active;
    const rolesCount = roles.length;
    return { total, active, inactive, rolesCount };
  }, [users, roles]);

  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredUsers = users.filter((u) => {
    const roleName = rolesMap.get(u.roleID) || "";
    const matchesSearch =
      u.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roleName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "ALL" ||
      roleName.toLowerCase() === selectedRole.toLowerCase() ||
      String(u.roleID) === selectedRole;

    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "ACTIVE" && u.isActive) ||
      (selectedStatus === "INACTIVE" && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50/50" dir="rtl">
      {/* الترويسة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-r-4 border-lime-700 pr-3">
            إدارة حسابات ومستخدمي النظام
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            إدارة كافة الحسابات وصلاحيات الوصول الإدارية والتعليمية
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={openAddModal}
            className="bg-lime-800 hover:bg-lime-900 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة مستخدم جديد
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="shadow-md hover:shadow-lg transition-all text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <Users className="w-9 h-9 text-blue-700" />
            <CardTitle className="text-base font-medium">
              إجمالي المستخدمين
              <div className="text-2xl font-bold text-blue-600 mt-1">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">كافة الحسابات المسجلة</div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <UserCheck className="w-9 h-9 text-green-700" />
            <CardTitle className="text-base font-medium">
              حسابات نشطة
              <div className="text-2xl font-bold text-green-600 mt-1">{stats.active}</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.total > 0
                  ? `${Math.round((stats.active / stats.total) * 100)}% من المجموع`
                  : "لا يوجد حسابات"}
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <UserX className="w-9 h-9 text-red-600" />
            <CardTitle className="text-base font-medium">
              حسابات معطلة
              <div className="text-2xl font-bold text-red-600 mt-1">{stats.inactive}</div>
              <div className="text-xs text-gray-500 mt-1">حسابات تحتاج مراجعة</div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <ShieldCheck className="w-9 h-9 text-purple-700" />
            <CardTitle className="text-base font-medium">
              الأدوار والصلاحيات
              <div className="text-2xl font-bold text-purple-600 mt-1">{stats.rolesCount}</div>
              <div className="text-xs text-gray-500 mt-1">أنواع الأدوار المعرفة</div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو البريد..."
            className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-700"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="w-full sm:w-48">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="تصفية حسب الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">كافة الأدوار والصلاحيات</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.name || String(r.id)}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-44">
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

      {/* الجدول */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-lime-700 animate-spin" />
            <span className="mr-3 text-gray-600">جاري تحميل بيانات المستخدمين...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
            <Button onClick={loadData} variant="outline" className="mt-3">
              إعادة المحاولة
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <ShieldCheck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-base font-semibold">لا يوجد مستخدمون حالياً</p>
            <Button onClick={openAddModal} variant="outline" className="mt-4 text-lime-800 border-lime-800">
              إضافة مستخدم
            </Button>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-right table-fixed border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-700 text-xs font-bold uppercase">
                  <th className="p-3 w-1/4">اسم المستخدم</th>
                  <th className="p-3 w-1/4 hidden sm:table-cell">البريد الإلكتروني</th>
                  <th className="p-3 w-1/6">الدور / الصلاحية</th>
                  <th className="p-3 w-1/6 hidden md:table-cell">رقم الهاتف</th>
                  <th className="p-3 w-20 text-center">حالة الحساب</th>
                  <th className="p-3 w-20 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.map((user) => {
                  const roleName = rolesMap.get(user.roleID) || `دور ${user.roleID}`;
                  const id = user.id || user.UserId;
                  return (
                    <tr key={id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-3 truncate">
                        <div className="font-bold text-gray-900 truncate">{user.userName}</div>
                        <div className="text-xs text-gray-500 truncate sm:hidden" dir="ltr">{user.email}</div>
                      </td>
                      <td className="p-3 text-gray-600 text-xs truncate hidden sm:table-cell" dir="ltr">{user.email}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 bg-lime-50 text-lime-800 rounded-full text-xs font-bold border border-lime-200">
                          {roleName}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 text-xs hidden md:table-cell" dir="ltr">{user.phone || "-"}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "نشط" : "معطل"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
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
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 border-r-4 border-lime-700 pr-2">
              {editingUser ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              أدخل بيانات الحساب وحدد الدور وحالة التفعيل
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">
                  الاسم الكامل <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userName"
                  value={form.userName}
                  onChange={(e) => setForm({ ...form, userName: e.target.value })}
                  placeholder="مثال: خالد أحمد"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userRole">
                  الدور / الصلاحية <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={String(form.roleID)}
                  onValueChange={(val) => setForm({ ...form, roleID: Number(val) })}
                >
                  <SelectTrigger id="userRole">
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => {
                      const id = r.id || r.RoleId;
                      const name = r.name || r.RoleName;
                      return (
                        <SelectItem key={id} value={String(id)}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userEmail">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userEmail"
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@school.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userPhone">رقم الهاتف</Label>
                <Input
                  id="userPhone"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="05XXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userPassword">
                  كلمة المرور {editingUser ? "(اتركها فارغة للتخطي)" : <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="userPassword"
                  type="password"
                  dir="ltr"
                  value={form.passwordInput || ""}
                  onChange={(e) => setForm({ ...form, passwordInput: e.target.value })}
                  placeholder="••••••••"
                  required={!editingUser}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userActive">حالة الحساب</Label>
                <Select
                  value={form.isActive ? "true" : "false"}
                  onValueChange={(val) => setForm({ ...form, isActive: val === "true" })}
                >
                  <SelectTrigger id="userActive">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">نشط</SelectItem>
                    <SelectItem value="false">معطل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userGender">الجنس</Label>
                <Select
                  value={form.gender}
                  onValueChange={(val) => setForm({ ...form, gender: val })}
                >
                  <SelectTrigger id="userGender">
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ذكر">ذكر</SelectItem>
                    <SelectItem value="أنثى">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userDob">تاريخ الميلاد</Label>
                <Input
                  id="userDob"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-lime-800 hover:bg-lime-900 text-white">
                {isSubmitting ? "جاري الحفظ..." : editingUser ? "تحديث المستخدم" : "إضافة المستخدم"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">تأكيد حذف المستخدم</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              هل أنت متأكد من رغبتك في حذف الحساب <span className="font-bold text-gray-900">"{deleteTarget?.userName}"</span>؟
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
