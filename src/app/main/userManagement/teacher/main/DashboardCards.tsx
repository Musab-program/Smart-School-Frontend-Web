"use client"

import { UserStar, Users, UserMinus, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardsProps {
  totalTeachers: number;
  activeTeachers: number;
  inactiveTeachers: number;
  totalSpecialties: number;
}

const DashboardCards = ({ 
  totalTeachers, 
  activeTeachers, 
  inactiveTeachers, 
  totalSpecialties 
}: DashboardCardsProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
      <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <Users className='w-10 h-10 text-blue-700' />
          <CardTitle className="text-lg font-medium">
            إجمالي المعلمين
            <br />
            <div className="text-2xl font-bold text-blue-600">{totalTeachers}</div>
            <div className="text-sm text-gray-500 mt-1">العدد الكلي للمعلمين</div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <UserStar className='w-10 h-10 text-green-700' />
          <CardTitle className="text-lg font-medium">
            معلمون نشطون
            <br />
            <div className="text-2xl font-bold text-green-600">{activeTeachers}</div>
            <div className="text-sm text-gray-500 mt-1">
              {totalTeachers > 0 
                ? `${Math.round((activeTeachers / totalTeachers) * 100)}% من المجموع`
                : 'لا يوجد معلمين'
              }
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <UserMinus className='w-10 h-10 text-red-700' />
          <CardTitle className="text-lg font-medium">
            غير نشطين
            <br />
            <div className="text-2xl font-bold text-red-600">{inactiveTeachers}</div>
            <div className="text-sm text-gray-500 mt-1">حسابات تحتاج تفعيل</div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <GraduationCap className='w-10 h-10 text-purple-700' />
          <CardTitle className="text-lg font-medium">
            التخصصات
            <br />
            <div className="text-2xl font-bold text-purple-600">{totalSpecialties}</div>
            <div className="text-sm text-gray-500 mt-1">عدد التخصصات المتاحة</div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DashboardCards;
