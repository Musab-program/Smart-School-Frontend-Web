import { Teacher } from '@/types/teacher';
import { Specialty } from '@/types/specialty';
import { UserStar, Users, UserMinus } from 'lucide-react';
import { getTeacher } from '@/lib/api';
import { getSpecialty } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardCards = async () => {
  const teachers: Teacher[] = await getTeacher();
  const specialties: Specialty[] = await getSpecialty();
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.IsActive).length;
  const inactiveTeachers = teachers.filter(t => !t.IsActive).length;
  const totalSpecialties = specialties.length;
  const culomnTable = teachers.keys
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">إدارة المعلمين</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mb-6">

        <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <Users className='w-10 h-10  text-blue-700 ' />
            <CardTitle className="text-lg font-sm">
              إجمالي المعلمين
              <br /><div className="text-2xl font-bold">{totalTeachers}</div>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <UserStar className='w-10 h-10  text-green-700 ' />
            <CardTitle className="text-lg font-sm">
              معلمون نشطون
              <br /><div className="text-2xl font-bold">{activeTeachers}</div>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 drop-shadow-lg text-right">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <UserMinus className='w-10 h-10  text-red-700 ' />
            <CardTitle className="text-lg font-sm">
              غير نشطين
              <br /><div className="text-2xl font-bold">{inactiveTeachers}</div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <p>
        {/* {
          culomnTable.forEach(column => {
            column
          });
          
        } */}
      </p>
    </div>
  )
}

export default DashboardCards
