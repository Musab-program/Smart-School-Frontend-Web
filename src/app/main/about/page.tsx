import { DataTableDemo } from "./grid";
import { getTeacherAnalytics } from "../userManagement/teacher/main/api-providers";


const AboutPage = async () => {
  // const [teachers, specialties]: [Teacher[], Specialty[]] = await Promise.all([
  //   getTeacher(),
  //   getSpecialty(),
  // ]);

  const teacherData = await getTeacherAnalytics();
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">جدول المعلمين - About</h1>
      <DataTableDemo data={teacherData.teachers} specialties={teacherData.specialties} />
    </div>
  )
}

export default AboutPage

/*

*/


// rm -rf node_modules
// rm package-lock.json
// # أو rm yarn.lock إذا كنت تستخدم Yarn