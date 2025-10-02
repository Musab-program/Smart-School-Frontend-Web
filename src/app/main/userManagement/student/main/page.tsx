// File: components/students/StudentsPage.js
import { DashboardCards } from "./DashboardCards";
import StudentsTable from "./StudentsTable";
import React from "react";

export default function StudentsPage() {
  return (
    <div className="p-4">
      <DashboardCards />
      <StudentsTable />
    </div>
  );
}