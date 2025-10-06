// components/TeachersDashboard.tsx

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {  Specialty } from '@/types/specialty'; 
import { Teacher} from '@/types/teacher'; 

import { TeachersTable } from './TeacherTable';

interface TeachersDashboardProps {
  initialData: {
    teachers: Teacher[];
    specialties: Specialty[];
    totalTeachers: number;
    totalSpecialties: number;
    activeTeachers: number;
    inactiveTeachers: number;
  };
}



export function TeachersDashboard({ initialData }: TeachersDashboardProps) {
    const [teachers, setTeachers] = useState<Teacher[]>(initialData.teachers);
    
    const [sortState, setSortState] = useState<{ key: string, direction: 'asc' | 'desc' }>({ 
      key: 'UserId', 
      direction: 'asc' 
    });

    
    const [filterState] = useState<{ specialtyId: number | null, qualification: string | null }>({ 
      specialtyId: null, 
      qualification: null 
    });


    const compare = useCallback((a: Teacher, b: Teacher, key: string, direction: 'asc' | 'desc', specialties: Specialty[]) => {
        // 1. تحديد القيمتين المراد مقارنتهما بنوع أكثر مرونة (any أو string | number)
        // سنستخدم any في البداية ثم نضمن أنها نص/رقم قبل المقارنة
        let aValue: unknown = a[key as keyof Teacher];
        let bValue: unknown = b[key as keyof Teacher];
      
        // 2. معالجة الحقول غير الموجودة مباشرة في المعلم
        if (key === 'SpecialtyId') {
          aValue = specialties.find(s => s.SpecialtyId === a.SpecialtyId)?.SpecialtyName || '';
          bValue = specialties.find(s => s.SpecialtyId === b.SpecialtyId)?.SpecialtyName || '';
        } else if (key === 'Qualification') {
          aValue = specialties.find(s => s.SpecialtyId === a.SpecialtyId)?.Qualification || '';
          bValue = specialties.find(s => s.SpecialtyId === b.SpecialtyId)?.Qualification || '';
        } else if (key === 'IsActive') {
          // التحويل إلى رقم لضمان المقارنة الصحيحة
          aValue = a.IsActive ? 1 : 0;
          bValue = b.IsActive ? 1 : 0;
        }
        
        // 👈 الحل: تحويل القيمة إلى نص (string) أو التأكد من أنها رقم
        const finalA = (aValue ?? '').toString(); // إذا كانت null/undefined، اجعلها نصًا فارغًا ثم حولها لنص
        const finalB = (bValue ?? '').toString();
      
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (aValue < bValue) {
              return direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
              return direction === 'asc' ? 1 : -1;
            }
        } else {
            if (finalA < finalB) {
              return direction === 'asc' ? -1 : 1;
            }
            if (finalA > finalB) {
              return direction === 'asc' ? 1 : -1;
            }
        }
      
        return 0;
      }, []);

  // components/TeachersDashboard.tsx (داخل دالة المكون)

  // useMemo لتطبيق الفرز والترتيب بكفاءة فقط عند تغير الحالة
  const filteredAndSortedTeachers = useMemo(() => {
    // 1. البدء بنسخة من البيانات الأصلية
    let currentTeachers = [...initialData.teachers];

    // 2. تطبيق الفرز (Filtering)
    currentTeachers = currentTeachers.filter(teacher => {
      // أ. الفرز حسب التخصص
      const specialtyMatch = filterState.specialtyId === null || teacher.SpecialtyId === filterState.specialtyId;

      // ب. الفرز حسب المؤهل (نحتاج لجلب المؤهل أولاً)
      const qualification = initialData.specialties.find(s => s.SpecialtyId === teacher.SpecialtyId)?.Qualification || '';
      const qualificationMatch = filterState.qualification === null || qualification === filterState.qualification;

      return specialtyMatch && qualificationMatch;
    });

    // 3. تطبيق الترتيب (Sorting)
    currentTeachers.sort((a, b) => 
      compare(a, b, sortState.key, sortState.direction, initialData.specialties)
    );

    return currentTeachers;
  }, [initialData.teachers, sortState, filterState, initialData.specialties, compare]); // الاعتماديات (Dependencies)
  
  // تحديث قائمة المعلمين المعروضة
  useEffect(() => {
      setTeachers(filteredAndSortedTeachers);
  }, [filteredAndSortedTeachers]);


  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortState({ key, direction });
  };
  
  // دالة لمعالجة التغيرات من مكون الفرز (محفوظة للاستخدام المستقبلي)
  // const handleFilterChange = (filters: { specialtyId: number | null, qualification: string | null }) => {
  //   setFilterState(filters);
  // };
  
  // دوال وهمية للتعديل والحذف (تُنَفَّذ لاحقاً عند إنشاء نماذج الإدخال)
  const handleEdit = (teacher: Teacher) => console.log("Edit teacher:", teacher.userId);
  const handleDelete = (teacherId: number) => console.log("Delete teacher:", teacherId);

// components/TeachersDashboard.tsx (داخل دالة المكون)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">جدول بيانات المعلمين</h2>
        <TeachersTable 
          teachers={teachers}
          specialties={initialData.specialties}
          onSort={handleSort} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
}

