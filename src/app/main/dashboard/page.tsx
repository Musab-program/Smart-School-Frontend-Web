"use client";

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">إجمالي الطلاب</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">إجمالي المعلمين</h3>
          <p className="text-3xl font-bold text-green-600">89</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">الصفوف</h3>
          <p className="text-3xl font-bold text-purple-600">24</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">الاختبارات</h3>
          <p className="text-3xl font-bold text-orange-600">156</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الطلاب الجدد</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">أحمد محمد</span>
              <span className="text-sm text-gray-500">الصف الأول</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">فاطمة علي</span>
              <span className="text-sm text-gray-500">الصف الثاني</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">محمد حسن</span>
              <span className="text-sm text-gray-500">الصف الثالث</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الاختبارات القادمة</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">امتحان الرياضيات</span>
              <span className="text-sm text-gray-500">غداً</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">امتحان العلوم</span>
              <span className="text-sm text-gray-500">بعد غد</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">امتحان اللغة العربية</span>
              <span className="text-sm text-gray-500">الأسبوع القادم</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}