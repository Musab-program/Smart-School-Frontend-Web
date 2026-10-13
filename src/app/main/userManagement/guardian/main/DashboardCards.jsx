"use client";

import React, { useState, useEffect } from "react";
import { getGuardians } from "@/lib/api";
import { Users, UserCheck, UserX } from "lucide-react";

export function DashboardCards() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    getGuardians()
      .then((data) => {
        const list = data || [];
        const active = list.filter(
          (g) =>
            g.isActive === true ||
            g.isActive === "true" ||
            g.IsActive === true ||
            g.status === "نشط"
        ).length;
        setStats({
          total: list.length,
          active,
          inactive: list.length - active,
        });
      })
      .catch((err) => console.error("فشل جلب إحصائيات أولياء الأمور:", err));
  }, []);

  const cards = [
    {
      icon: <Users className="h-6 w-6 text-white" />,
      label: "إجمالي أولياء الأمور",
      value: stats.total,
      color: "bg-blue-600",
    },
    {
      icon: <UserCheck className="h-6 w-6 text-white" />,
      label: "أولياء الأمور النشطون",
      value: stats.active,
      color: "bg-green-600",
    },
    {
      icon: <UserX className="h-6 w-6 text-white" />,
      label: "أولياء الأمور غير النشطين",
      value: stats.inactive,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6" dir="rtl">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow p-5 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className={`p-3 rounded-xl ${card.color} flex items-center justify-center`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}