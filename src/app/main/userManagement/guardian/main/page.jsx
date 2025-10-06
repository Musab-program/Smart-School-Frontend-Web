// File: components/students/StudentsPage.js
import { DashboardCards } from "./DashboardCards";
import GuardianTable from "./GuardianTable";
import React from "react";

export default function StudentsPage() {
  return (
    <div className="p-4">
      <DashboardCards />
      <GuardianTable />
    </div>
  );
}