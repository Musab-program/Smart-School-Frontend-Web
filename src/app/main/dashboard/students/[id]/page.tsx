"use client";

import React from 'react';
import { useParams } from 'next/navigation';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id;

  // بيانات وهمية للطالب
  const student = {
    id: studentId,
    name: "أحمد محمد",
    grade: "الصف الأول",
    email: "ahmed@example.com",
    phone: "01234567890",
    address: "القاهرة، مصر",
    birthDate: "2010-05-15",
    parentName: "محمد أحمد",
    parentPhone: "01234567891",
  };

  const grades = [
    { subject: "الرياضيات", grade: 95, date: "2024-01-15" },
    { subject: "العلوم", grade: 88, date: "2024-01-20" },
    { subject: "اللغة العربية", grade: 92, date: "2024-01-25" },
    { subject: "اللغة الإنجليزية", grade: 85, date: "2024-01-30" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">تفاصيل الطالب</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          تعديل البيانات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* معلومات الطالب */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">الاسم:</span>
              <span className="font-medium">{student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الصف:</span>
              <span className="font-medium">{student.grade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">البريد الإلكتروني:</span>
              <span className="font-medium">{student.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">رقم الهاتف:</span>
              <span className="font-medium">{student.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">العنوان:</span>
              <span className="font-medium">{student.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">تاريخ الميلاد:</span>
              <span className="font-medium">{student.birthDate}</span>
            </div>
          </div>
        </div>

        {/* معلومات ولي الأمر */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات ولي الأمر</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">اسم ولي الأمر:</span>
              <span className="font-medium">{student.parentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">رقم هاتف ولي الأمر:</span>
              <span className="font-medium">{student.parentPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* الدرجات */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">الدرجات</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المادة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدرجة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {grade.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      grade.grade >= 90 ? 'bg-green-100 text-green-800' :
                      grade.grade >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


