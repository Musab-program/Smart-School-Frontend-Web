"use client"

import { GraduationCap, Briefcase, ArchiveX, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardsProps {
  totalSpecialties: number;
  activeSpecialties: number;
  inactiveSpecialties: number;
  averageTeachersPerSpecialty: string;
}

const DashboardCards = ({ 
  totalSpecialties, 
  activeSpecialties, 
  inactiveSpecialties, 
  averageTeachersPerSpecialty 
}: DashboardCardsProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
      <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <Layers className='w-10 h-10 text-purple-700' />
          <CardTitle className="text-lg font-medium">
            إجمالي التخصصات
            <br />
            <div className="text-2xl font-bold text-purple-600">{totalSpecialties}</div>
            <div className="text-sm text-gray-500 mt-1">العدد الكلي للتخصصات</div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <Briefcase className='w-10 h-10 text-green-700' />
          <CardTitle className="text-lg font-medium">
            تخصصات نشطة
            <br />
            <div className="text-2xl font-bold text-green-600">{activeSpecialties}</div>
            <div className="text-sm text-gray-500 mt-1">
              يوجد بها معلمين
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <ArchiveX className='w-10 h-10 text-red-700' />
          <CardTitle className="text-lg font-medium">
            غير نشطة
            <br />
            <div className="text-2xl font-bold text-red-600">{inactiveSpecialties}</div>
            <div className="text-sm text-gray-500 mt-1">بدون معلمين</div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <GraduationCap className='w-10 h-10 text-blue-700' />
          <CardTitle className="text-lg font-medium">
            متوسط المعلمين
            <br />
            <div className="text-2xl font-bold text-blue-600">{averageTeachersPerSpecialty}</div>
            <div className="text-sm text-gray-500 mt-1">لكل تخصص</div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DashboardCards;
