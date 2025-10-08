import React from "react";
import DashboardCards from "./DashboardCards";
import { getTeacherAnalytics } from "./api-providers";
import { TeacherTable } from "./TeachersTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TeacherPage() {
  // const teacherData = await getTeacherData();
  const teacherData = await getTeacherAnalytics();
  
  return (
    <div className="p-6 space-y-8 text-right">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">إدارة المعلمين</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">إحصائيات المعلمين</h2>
          <DashboardCards />
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
          {/* <TeachersDashboard initialData={teacherData} /> */}
          <TeacherTable data={teacherData.teachers} specialties={teacherData.specialties} />
        </div>
      </div>
    </div>
  );
}