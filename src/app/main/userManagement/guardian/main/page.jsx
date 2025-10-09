// File: components/students/StudentsPage.js
import { DashboardCards } from "./DashboardCards";
import GuardianTable from "./GuardianTable";
import React from "react";
// import { getGuardianAnalytics } from "./api-providers";


export default async function StudentsPage() {
  // const guar = await getGuardianAnalytics();guardiansData={guar.guardians}
  return (
    <div className="p-4">
      {/* <DashboardCards /> */}
      <GuardianTable />
    </div>
  );
}
