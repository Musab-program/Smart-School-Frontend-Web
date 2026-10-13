"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getStudents,
  getTeachers,
  getGuardians,
  getGrades,
  getGroups,
  getSpecialties,
  getUsers,
} from "@/lib/api";
import { Student } from "@/types/student";
import { Teacher } from "@/types/teacher";
import { Specialty } from "@/types/specialty";
import { Grade } from "@/types/grade";
import { Group } from "@/types/group";
import {
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  Layers,
  Award,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Shield,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#16a34a", "#2563eb", "#d97706", "#9333ea", "#0891b2"];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    studentsCount: 0,
    teachersCount: 0,
    guardiansCount: 0,
    gradesCount: 0,
    groupsCount: 0,
    specialtiesCount: 0,
    usersCount: 0,
  });

  const [gradeDistribution, setGradeDistribution] = useState<
    { name: string; capacity: number; groups: number }[]
  >([]);

  const [roleDistribution, setRoleDistribution] = useState<
    { name: string; value: number }[]
  >([]);

  const [recentStudents, setRecentStudents] = useState<
    { id?: number | null; name: string; grade: string; date: string }[]
  >([]);

  const [recentTeachers, setRecentTeachers] = useState<
    { id?: number | null; name: string; specialty: string; phone: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const [
          studentsData,
          teachersData,
          guardiansData,
          gradesData,
          groupsData,
          specialtiesData,
          usersData,
        ] = await Promise.all([
          getStudents().catch(() => []),
          getTeachers().catch(() => []),
          getGuardians().catch(() => []),
          getGrades().catch(() => []),
          getGroups().catch(() => []),
          getSpecialties().catch(() => []),
          getUsers().catch(() => []),
        ]);

        const students = studentsData || [];
        const teachers = teachersData || [];
        const guardians = guardiansData || [];
        const grades = gradesData || [];
        const groups = groupsData || [];
        const specialties = specialtiesData || [];
        const users = usersData || [];

        setStats({
          studentsCount: students.length,
          teachersCount: teachers.length,
          guardiansCount: guardians.length,
          gradesCount: grades.length,
          groupsCount: groups.length,
          specialtiesCount: specialties.length,
          usersCount: users.length,
        });

        // توزيع الفصول والشعب والقدرة الاستيعابية
        const gradesMap = new Map<number, { name: string; capacity: number; groups: number }>();
        grades.slice(0, 8).forEach((g: Grade) => {
          if (g.id) {
            gradesMap.set(g.id, {
              name: g.name.replace("الصف ", "").replace("الابتدائي", "").replace("الإعدادي", "").trim(),
              capacity: g.capacity || 30,
              groups: 0,
            });
          }
        });

        groups.forEach((grp: Group) => {
          const entry = gradesMap.get(grp.gradeId);
          if (entry) {
            entry.groups += 1;
          }
        });

        setGradeDistribution(Array.from(gradesMap.values()));

        // توزيع فئات المستخدمين في النظام
        setRoleDistribution([
          { name: "الطلاب", value: students.length || 5 },
          { name: "المعلمين", value: teachers.length || 5 },
          { name: "أولياء الأمور", value: guardians.length || 5 },
          { name: "الإداريين", value: Math.max(users.length - (students.length + teachers.length + guardians.length), 1) },
        ]);

        // آخر الطلاب المسجلين
        setRecentStudents(
          students.slice(-5).reverse().map((s: Student) => ({
            id: s.id,
            name: s.userName || "طالب جديد",
            grade: s.groupName || `شعبة ${s.groupId || 1}`,
            date: s.registerDate ? new Date(s.registerDate).toLocaleDateString("ar-EG") : "اليوم",
          }))
        );

        // نخبة المعلمين
        const specMap = new Map(specialties.map((sp: Specialty) => [sp.id, sp.name]));
        setRecentTeachers(
          teachers.slice(0, 5).map((t: Teacher) => ({
            id: t.id,
            name: t.userName || "معلم",
            specialty: (t.specialtyId && specMap.get(t.specialtyId)) || "عام",
            phone: t.phone || "-",
          }))
        );
      } catch (err) {
        console.error("فشل تحميل بيانات لوحة التحكم:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const kpis = [
    {
      title: "إجمالي الطلاب",
      value: stats.studentsCount,
      subtext: "طالب وطالبة مسجلين",
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      link: "/main/userManagement/student/main",
    },
    {
      title: "هيئة التدريس",
      value: stats.teachersCount,
      subtext: "معلم ومعلمة معتمدين",
      icon: GraduationCap,
      color: "text-green-600 bg-green-50 border-green-100",
      link: "/main/userManagement/teacher/main",
    },
    {
      title: "أولياء الأمور",
      value: stats.guardiansCount,
      subtext: "أولياء أمور متابعين",
      icon: UserCheck,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      link: "/main/userManagement/guardian/main",
    },
    {
      title: "الصفوف والشعب",
      value: `${stats.gradesCount} / ${stats.groupsCount}`,
      subtext: "صف دراسي / شعبة تعليمية",
      icon: BookOpen,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      link: "/main/academic/grades",
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50/50 space-y-8" dir="rtl">
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              لوحة التحكم والإحصائيات الشاملة
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-lime-100 text-lime-800 text-xs font-bold rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              مباشر
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            متابعة فورية لمؤشرات الأداء الأكاديمي، الطاقة الاستيعابية، وتوزيع الهيئة التعليمية والطلاب
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left hidden sm:block">
            <div className="text-xs text-gray-400">العام الدراسي</div>
            <div className="text-sm font-bold text-gray-800">2026 - 2027 م</div>
          </div>
          <div className="h-8 w-px bg-gray-200 hidden sm:block" />
          <Link
            href="/main/academic/grades"
            className="px-4 py-2 bg-lime-800 hover:bg-lime-900 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            إدارة الصفوف
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* بطاقات المؤشرات الأساسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              href={kpi.link}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-gray-900">
                  {kpi.value}
                </span>
                <span className="text-xs font-medium text-gray-400">
                  {kpi.subtext}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* المخططات والرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* مخطط سعة الصفوف وتوزيع الشعب */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-lime-700" />
                توزيع الشعب والقدرة الاستيعابية للصفوف
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                مقارنة بين عدد الشعب المفتوحة والقدرة الاستيعابية المقدرة لكل صف
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
              الصفوف الأساسية
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            {gradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  />
                  <Bar dataKey="capacity" name="القدرة الاستيعابية" fill="#166534" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="groups" name="عدد الشعب" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                جاري إعداد بيانات المخطط...
              </div>
            )}
          </div>
        </div>

        {/* مخطط دائري لتوزيع مستخدمي النظام */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-lime-700" />
              توزيع الأدوار في المنظومة
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              نسبة كل فئة من إجمالي الحسابات المسجلة
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    direction: "rtl",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(val) => <span className="text-gray-700 font-medium">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-500">
              إجمالي الحسابات النشطة بالمنظومة: <strong className="text-gray-900">{stats.usersCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* جداول المعاينات السريعة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أحدث الطلاب المسجلين */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-lime-700" />
              الطلاب المسجلون حديثاً
            </h2>
            <Link
              href="/main/userManagement/student/main"
              className="text-xs font-semibold text-lime-800 hover:text-lime-900 flex items-center gap-1"
            >
              عرض الكل
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentStudents.length > 0 ? (
              recentStudents.map((st, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{st.name}</div>
                    <div className="text-xs text-gray-500">{st.grade}</div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">{st.date}</div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-gray-400">
                لا توجد سجلات حالية
              </div>
            )}
          </div>
        </div>

        {/* الكادر التعليمي والتخصصات */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-lime-700" />
              أعضاء الهيئة التعليمية
            </h2>
            <Link
              href="/main/userManagement/teacher/main"
              className="text-xs font-semibold text-lime-800 hover:text-lime-900 flex items-center gap-1"
            >
              عرض الكل
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentTeachers.length > 0 ? (
              recentTeachers.map((tc, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{tc.name}</div>
                    <div className="text-xs text-lime-800 font-semibold">{tc.specialty}</div>
                  </div>
                  <div className="text-xs text-gray-500" dir="ltr">
                    {tc.phone}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-gray-400">
                لا توجد سجلات حالية
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}