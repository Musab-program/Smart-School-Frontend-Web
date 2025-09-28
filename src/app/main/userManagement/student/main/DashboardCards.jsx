
"use client";
// File: components/dashboard/DashboardCards.js
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { UserGroupIcon, AcademicCapIcon, BanknotesIcon } from "@heroicons/react/24/solid";

export function DashboardCards() {
  const stats = [
    { icon: <UserGroupIcon className="h-6 w-6 text-white" />, label: "إجمالي الطلاب", value: "2,500", color: "bg-blue-500" },
    { icon: <AcademicCapIcon className="h-6 w-6 text-white" />, label: "الطلاب النشطون", value: "2,350", color: "bg-green-500" },
    { icon: <BanknotesIcon className="h-6 w-6 text-white" />, label: "الرسوم المتأخرة", value: "1,200", color: "bg-orange-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="drop-shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="font-semibold">
                {stat.label}
              </Typography>
              <Typography variant="h4" color="gray" className="font-bold">
                {stat.value}
              </Typography>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}