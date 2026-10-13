"use client";

import React, { useState, useEffect } from "react";
import App from "./Form";
import { getSpecialtyAnalytics, SpecialtyAnalyticsResult } from "../main/api-providers";

export default function Page() {
  const [data, setData] = useState<SpecialtyAnalyticsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getSpecialtyAnalytics();
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
