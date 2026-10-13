"use client"

import React, { useState, useEffect, useCallback } from "react";
import DashboardCards from "./DashboardCards";
import { getSpecialtyAnalytics, SpecialtyAnalyticsResult } from "./api-providers";
import { SpecialtiesTable } from "./SpecialtiesTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [data, setData] = useState<SpecialtyAnalyticsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getSpecialtyAnalytics();
      setData(result);
    } catch (err) {
      console.error("Error loading specialties:", err);
      setError("فشل في تحميل بيانات التخصصات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading && !data) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen">
        <Loader2 className="w-10 h-10 text-lime-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl font-bold mb-4">{error}</p>
        <Button onClick={() => loadData()} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div dir="rtl" className="p-6 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-r-4 border-lime-600 pr-3">
            إدارة التخصصات
          </h1>
          <p className="text-gray-500 mt-2 pr-4 text-sm">
            إضافة، تعديل، وحذف التخصصات الأكاديمية
          </p>
        </div>
        <Link href="/main/specialties/add">
          <Button className="bg-lime-700 hover:bg-lime-800 text-white shadow-md shadow-lime-700/20 px-6 font-semibold h-11">
            + إضافة تخصص جديد
          </Button>
        </Link>
      </div>

      <DashboardCards
        totalSpecialties={data.totalSpecialties}
        activeSpecialties={data.activeSpecialties}
        inactiveSpecialties={data.inactiveSpecialties}
        averageTeachersPerSpecialty={data.averageTeachersPerSpecialty}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">قائمة التخصصات</h2>
          <p className="text-sm text-gray-500 mt-1">عرض تفصيلي لجميع التخصصات المتاحة</p>
        </div>
        
        <SpecialtiesTable 
          data={data.specialtiesWithTeachers} 
          onSpecialtyDeleted={loadData} 
        />
      </div>
    </div>
  );
}