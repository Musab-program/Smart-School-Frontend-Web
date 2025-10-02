"use client";
import  DashboardCards  from "./DashboardCards";
import  {TeachersTable}  from "./TeacherTable";
import { getTeacherData } from '@/lib/ready-data/teacher-data';

import React from "react";

export default async function TeacherPage() {
  const teacherData = await getTeacherData();
  return (
    <div className="">
      <div>
        <h2>إحصائيات المعلمين</h2>
        <DashboardCards/>
      </div>

      <div>
        <h2> فرز المعلمين</h2>
      </div>

      <div>
        <h2>جدول المعلمين</h2>
        <TeachersTable teachers={teacherData.teachers} 
        specialties={teacherData.specialties}
        />
      </div>

    </div>

    // <div className="p-4">
    //   <DashboardCards />
    //   <StudentsTable />
    // </div>
  );
}