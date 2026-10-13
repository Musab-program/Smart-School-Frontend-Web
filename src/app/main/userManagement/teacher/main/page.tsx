"use client"

import React, { useState, useEffect, useCallback } from "react";
import DashboardCards from "./DashboardCards";
import { getTeacherAnalytics } from "./api-providers";
import { TeacherTable } from "./TeachersTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TeacherFilters } from "./select";
import { Teacher } from "@/types/teacher";
import { Specialty } from "@/types/specialty";

interface TeacherAnalytics {
  teachers: Teacher[];
  specialties: Specialty[];
  totalTeachers: number;
  activeTeachers: number;
  inactiveTeachers: number;
  totalSpecialties: number;
  teachersBySpecialty: Array<{
    specialtyId: number;
    specialtyName: string;
    teacherCount: number;
  }>;
  activationRate: string;
  averageTeachersPerSpecialty: string;
}

export default function TeacherPage() {
  const [teacherData, setTeacherData] = useState<TeacherAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [filters, setFilters] = useState<{ specialtyId: string | null, qualification: string | null }>({
    specialtyId: null,
    qualification: null
  });

  // دالة لجلب البيانات
  const fetchTeacherData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTeacherAnalytics();
      setTeacherData(data);
    } catch (err) {
      console.error("خطأ في جلب بيانات المعلمين:", err);
      setError("فشل في جلب بيانات المعلمين");
    } finally {
      setIsLoading(false);
    }
  };

  // دالة إعادة تحديث البيانات بعد الحذف
  const handleTeacherDeleted = async () => {
    try {
      setIsRefreshing(true);
      await fetchTeacherData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // دالة فلترة المعلمين
  const filterTeachers = useCallback((teachers: Teacher[], filters: { specialtyId: string | null, qualification: string | null }) => {
    return teachers.filter(teacher => {
      // فلترة حسب التخصص
      if (filters.specialtyId && teacher.specialtyId.toString() !== filters.specialtyId) {
        return false;
      }
      
      // فلترة حسب المؤهل - نحصل على المؤهل من التخصص
      if (filters.qualification && teacherData) {
        const specialty = teacherData.specialties.find(s => s.id === teacher.specialtyId);
        if (!specialty || specialty.qualification !== filters.qualification) {
          return false;
        }
      }
      
      return true;
    });
  }, [teacherData]);

  // تحديث المعلمين المفلترين عند تغيير البيانات أو الفلاتر
  useEffect(() => {
    if (teacherData) {
      const filtered = filterTeachers(teacherData.teachers, filters);
      setFilteredTeachers(filtered);
    }
  }, [teacherData, filters, filterTeachers]);

  // دالة معالجة تغيير الفلاتر
  const handleFiltersChange = (newFilters: { specialtyId: string | null, qualification: string | null }) => {
    setFilters(newFilters);
  };

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchTeacherData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 text-right">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">جاري تحميل البيانات...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-8 text-right">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="p-6 space-y-8 text-right">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">لا توجد بيانات متاحة</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-8 text-right">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">إدارة المعلمين</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">إحصائيات المعلمين</h2>
          <DashboardCards 
            totalTeachers={teacherData.totalTeachers}
            activeTeachers={teacherData.activeTeachers}
            inactiveTeachers={teacherData.inactiveTeachers}
            totalSpecialties={teacherData.totalSpecialties}
          />
        </div>

        <div className="m-10">
          <TeacherFilters 
            specialties={teacherData.specialties} 
            onFiltersChange={handleFiltersChange}
          />
        </div>

        <div>
          <div className="flex justify-between">
          <Link href="./add">
          <Button size="sm" className='bg-lime-700 hover:bg-lime-900'>
          + إضافة معلم جديد
        </Button>
          </Link>
          <h2 className="text-xl font-semibold text-gray-800 mb-4"> المعلمين</h2>
          </div>
          <div className="relative">
            {isRefreshing && (
              <div className="absolute top-0 left-0 right-0 bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 z-10">
                <div className="flex items-center justify-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  جاري تحديث البيانات...
                </div>
              </div>
            )}
            <TeacherTable 
              data={filteredTeachers} 
              specialties={teacherData.specialties} 
              onTeacherDeleted={handleTeacherDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}