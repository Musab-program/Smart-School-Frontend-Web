// File: components/students/StudentsPage.js
import { DashboardCards } from "./DashboardCards";
import { TeacherTable } from "./TeacherTable";
import React from "react";

export default function TeacherPage() {
  return (
    <div className="">
      <div>
        <h2>إحصائيات المعلمين</h2>
      </div>

      <div>
        <h2> فرز المعلمين</h2>
      </div>

      <div>
        <h2>جدول المعلمين</h2>
      </div>

    </div>

    // <div className="p-4">
    //   <DashboardCards />
    //   <StudentsTable />
    // </div>
  );
}