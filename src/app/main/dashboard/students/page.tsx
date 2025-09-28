"use client";

import React from 'react';
import Link from 'next/link';

export default function StudentsPage() {
  const students = [
    { id: 1, name: "أحمد محمد", grade: "الصف الأول", email: "ahmed@example.com" },
    { id: 2, name: "فاطمة علي", grade: "الصف الثاني", email: "fatima@example.com" },
    { id: 3, name: "محمد حسن", grade: "الصف الثالث", email: "mohamed@example.com" },
    { id: 4, name: "عائشة أحمد", grade: "الصف الأول", email: "aisha@example.com" },
    { id: 5, name: "علي محمود", grade: "الصف الثاني", email: "ali@example.com" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الطلاب</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          إضافة طالب جديد
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الاسم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الصف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.grade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link 
                    href={`/dashboard/students/${student.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    عرض
                  </Link>
                  <button className="text-green-600 hover:text-green-900 mr-4">
                    تعديل
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


