// components/TeachersTable.tsx

import React from 'react';
// استيراد واجهات البيانات لضمان الأمان في TypeScript
import {  Specialty } from '@/types/specialty'; 
import {  Teacher } from '@/types/teacher'; 
// استيراد مكونات الجدول من shadcn/ui
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// استيراد أيقونات الإجراءات والترتيب من Lucide
import { Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
// استيراد مكون الزر من shadcn/ui
import { Button } from '@/components/ui/button'; 

// رؤوس الأعمدة: تحدد الترتيب والمفتاح لكل عمود
const TABLE_HEAD = [
  { label: "الرقم", key: "UserId" },
  { label: "المعلم", key: "UserName" },
  { label: "البريد الإلكتروني", key: "Email" },
  { label: "التلفون", key: "Phone" },
  { label: "التخصص", key: "SpecialtyId" },
  { label: "المؤهل", key: "Qualification" }, // المؤهل مربوط بالتخصص
  { label: "الحالة", key: "IsActive" },
  { label: "الجنس", key: "gender" },
  { label: "الراتب", key: "Salary" },
  { label: "تعديل", key: "edit_action" }, // عمود إجراء التعديل
  { label: "حذف", key: "delete_action" }, // عمود إجراء الحذف
];

// تحديد خصائص المكون
interface TeachersTableProps {
  teachers: Teacher[];       // قائمة المعلمين
  specialties: Specialty[];  // قائمة التخصصات لربط البيانات
  onSort: (key: string, direction: 'asc' | 'desc') => void; // دالة للترتيب
  onEdit: (teacher: Teacher) => void;                      // دالة للتعديل
  onDelete: (teacherId: number) => void;                   // دالة للحذف
}

export function TeachersTable({ 
  teachers, 
  specialties, 
  onSort, 
  onEdit, 
  onDelete 
}: TeachersTableProps) {
  
  // دالة مساعدة: تربط SpecialtyId باسم التخصص
  const getSpecialtyName = (id: number) => {
    // نبحث في مصفوفة التخصصات عن كائن مطابق ونُرجع اسمه
    return specialties.find(s => s.SpecialtyId === id)?.SpecialtyName || "غير محدد";
  };

  // دالة مساعدة: تجلب المؤهل من بيانات التخصص
  const getQualificationBySpecialtyId = (id: number) => {
    // نبحث عن التخصص المطابق للـ ID ونُرجع حقل Qualification
    return specialties.find(s => s.SpecialtyId === id)?.Qualification || "غير متوفر";
  };
  
  return (
    // الحاوية الرئيسية للجدول مع تصميم الحواف والظل
    <div className="rounded-lg border shadow-sm w-full">
      <div className="flex justify-end p-4">
        {/* زر إضافة معلم جديد */}
        <Button size="sm" className='bg-green-600 hover:bg-green-700'>
          + إضافة معلم جديد
        </Button>
      </div>
      
      {/* Table: مكون الجدول الأساسي */}
      <Table>
        {/* TableHeader: رأس الجدول */}
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50/50">
            {TABLE_HEAD.map(({ label, key }) => (
              // TableHead: كل عمود في الرأس
              <TableHead key={key} className="text-right font-bold text-gray-700">
                <div className="flex items-center justify-between">
                  {label}
                  {/* منطق عرض أيقونات الترتيب */}
                  {key !== 'edit_action' && key !== 'delete_action' && (
                    <div className='flex flex-col ml-2'>
                      {/* زر الترتيب التصاعدي */}
                      <ArrowUp 
                        size={14} 
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => onSort(key, 'asc')} 
                      />
                      {/* زر الترتيب التنازلي */}
                      <ArrowDown 
                        size={14} 
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => onSort(key, 'desc')} 
                      />
                    </div>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        
        {/* TableBody: جسم الجدول */}
        <TableBody>
          {teachers.map((teacher) => (
            // TableRow: صف لكل معلم
            <TableRow key={teacher.userId}>
              {TABLE_HEAD.map(({ key }) => (
                // TableCell: خلية لكل حقل
                <TableCell key={key} className="text-right py-3 align-middle">
                  
                  {/* منطق عرض حقل التعديل */}
                  {key === 'edit_action' ? (
                    <Button size="icon" variant="ghost" className='text-blue-500 hover:bg-blue-50' onClick={() => onEdit(teacher)}>
                      <Pencil size={18} />
                    </Button>
                  
                  // منطق عرض حقل الحذف
                  ) : key === 'delete_action' ? (
                    <Button size="icon" variant="ghost" className='text-red-500 hover:bg-red-50' onClick={() => onDelete(teacher.userId)}>
                      <Trash2 size={18} />
                    </Button>

                  // منطق عرض حقل التخصص
                  ) : key === 'SpecialtyId' ? (
                    getSpecialtyName(teacher.SpecialtyId)
                  
                  // منطق عرض حقل المؤهل
                  ) : key === 'Qualification' ? ( 
                    <span className="font-semibold text-gray-800">
                        {getQualificationBySpecialtyId(teacher.SpecialtyId)}
                    </span>

                  // منطق عرض حقل الحالة (نشط/غير نشط)
                  ) : key === 'IsActive' ? (
                    <span className={`py-1 px-3 rounded-full text-xs font-medium ${teacher.IsActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {teacher.IsActive ? "نشط" : "غير نشط"}
                    </span>
                  
                  // منطق عرض بقية الحقول (الاسم، البريد، الراتب...)
                  ) : (
                    // عرض القيمة مباشرةً باستخدام المفتاح
                    teacher[key as keyof Teacher] as React.ReactNode 
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}