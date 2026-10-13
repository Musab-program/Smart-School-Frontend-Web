"use client";

import React, { useState, useEffect } from "react";
import { getTeacherAnalytics } from "../main/api-providers";
import App from "./Form";
import { Teacher } from "@/types/teacher";
import { Specialty } from "@/types/specialty";

interface TeacherAnalytics {
  teachers: Teacher[];
  specialties: Specialty[];
  totalTeachers: number;
  activeTeachers: number;
  inactiveTeachers: number;
  totalSpecialties: number;
}

export default function Page() {
  const [data, setData] = useState<TeacherAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getTeacherAnalytics();
        setData(result);
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
        setError("فشل في جلب البيانات");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error || "لا توجد بيانات"}</div>
      </div>
    );
  }

  return <App data={data} />;
}
