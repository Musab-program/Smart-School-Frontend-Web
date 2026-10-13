// File: components/students/StudentsPage.js
import { DashboardCards } from "./DashboardCards";
import GuardianTable from "./GuardianTable";
import React from "react";
// import { getGuardianAnalytics } from "./api-providers";


export default function GuardiansPage() {
  return (
    <div className="p-4" dir="rtl">
      <DashboardCards />
      <GuardianTable />
    </div>
  );
}
