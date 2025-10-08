"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Teacher } from "@/types/teacher";
import { Specialty } from "@/types/specialty";


interface BasicInfo {
  fullName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  files: File[];
}

interface ProfessionalInfo {

  specialtyId: string;
  qualification: string;
  salary: number | string;
}

interface LoginDetails {
  password: string;
  isActive: boolean;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

type TeacherRecord = Teacher & {
  UserId: number;
  UserName: string;
  Email: string;
  Phone: string;
  Password?: string;
  DateOfBirth: string;
  IsActive: boolean;
  Address: string;
  gender: string;
};

type TeacherAnalytics = {
  teachers: Teacher[];
  specialties: Specialty[];
  totalTeachers: number;
  activeTeachers: number;
  inactiveTeachers: number;
  totalSpecialties: number;
};

interface FormProps {
  data: TeacherAnalytics;
}

const App: React.FC<FormProps> = ({ data }) => {
  // حالات النموذج
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    fullName: "",
    gender: "male",
    dateOfBirth: "",
    files: [],
  });

  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo>({
    specialtyId: "",
    qualification: "",
    salary: "",
  });

  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    password: "",
    isActive: true,
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "",
    email: "",
    address: "",
  });



  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const selectedTeacherId = useMemo(() => {
    if (!idParam) return null;
    const parsed = Number(idParam);
    return Number.isFinite(parsed) ? parsed : null;
  }, [idParam]);
  const isEditMode = Boolean(selectedTeacherId);

  function hasUserId(t: Teacher | Record<string, unknown>): t is TeacherRecord {
    return t != null && typeof t === "object" && "UserId" in t;
  }

  // المعلّم المحدد في وضع التعديل
  const selectedTeacher: TeacherRecord | undefined = useMemo(() => {
    if (!selectedTeacherId) return undefined;
    const found = data?.teachers?.find((t) => t.Id === selectedTeacherId || (hasUserId(t) && t.UserId === selectedTeacherId));
    return found as unknown as TeacherRecord | undefined;
  }, [data, selectedTeacherId]);

  // تعبئة الحقول عند وضع التعديل
  useEffect(() => {
    if (!selectedTeacher) return;

    setBasicInfo(prev => ({
      ...prev,
      fullName: selectedTeacher.UserName || "",
      gender: (selectedTeacher.gender === "female" ? "female" : "male"),
      dateOfBirth: selectedTeacher.DateOfBirth ? String(selectedTeacher.DateOfBirth) : "",
      files: [],
    }));

    setProfessionalInfo(prev => ({
      ...prev,
      specialtyId: String(selectedTeacher.SpecialtyId ?? ""),
      qualification: "", // غير متوفر مباشرة في Teacher، يمكن ربطه من التخصص إذا لزم
      salary: selectedTeacher.Salary ?? "",
    }));

    setLoginDetails(prev => ({
      ...prev,
      password: selectedTeacher.Password || "",
      isActive: Boolean(selectedTeacher.IsActive),
    }));

    setContactInfo(prev => ({
      ...prev,
      phone: selectedTeacher.Phone || "",
      email: selectedTeacher.Email || "",
      address: selectedTeacher.Address || "",
    }));
  }, [selectedTeacher]);

  // معالجة تغيير الملفات
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setBasicInfo({ ...basicInfo, files: selectedFiles });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    setBasicInfo({ ...basicInfo, files: droppedFiles });
  };

  // معالجة تغيير حقول النموذج بشكل عام
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: "basic" | "professional" | "login" | "contact" | "additional",
    field: string
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const isCheckbox = (target as HTMLInputElement).type === "checkbox";
    const nextValue = isCheckbox
      ? (target as HTMLInputElement).checked
      : target.value;

    if (section === "basic") {
      setBasicInfo({ ...basicInfo, [field]: nextValue as never });
    } else if (section === "professional") {
      setProfessionalInfo({ ...professionalInfo, [field]: nextValue as never });
    } else if (section === "login") {
      setLoginDetails({ ...loginDetails, [field]: nextValue as never });
    } else if (section === "contact") {
      setContactInfo({ ...contactInfo, [field]: nextValue as never });
    } 
  };

  // معالجة إرسال النموذج
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("تم إرسال البيانات:", {
      basicInfo,
      professionalInfo,
      loginDetails,
      contactInfo,
    });
    setMessage({ type: "success", text: "تم حفظ النموذج بنجاح!" });
  };

  // معالجة إعادة تعيين النموذج
  const handleReset = () => {
    setBasicInfo({
      fullName: "",
      gender: "male",
      
      dateOfBirth: "",
      files: [],
    });
    setProfessionalInfo({
      specialtyId: "",
      qualification: "",
      salary: "",
    });
    setLoginDetails({
      isActive: true,
      password: "",
    });
    setContactInfo({
      phone: "",
      email: "",
      address: "",
    });
    setMessage(null);
  };

  return (
    <div dir="rtl" className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? "تعديل بيانات المعلم" : "إضافة معلم جديد"}</h1>
        <div className="space-x-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white font-semibold bg-lime-700 rounded-lg hover:bg-lime-800 transition-colors"
          >
            {isEditMode ? "تحديث" : "حفظ"}
          </button>
          <button
            onClick={() =>
              setMessage({ type: "error", text: "تم إلغاء العملية." })
            }
            className="px-6 py-2 text-gray-200 font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 text-gray-600 font-semibold bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            إعادة
          </button>
        </div>
      </div>

      {/* رسالة التأكيد المخصصة */}
      {message && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg drop-shadow-lg z-50 text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <p>{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* العمود الأيمن */}
        <div className="space-y-8">
          {/* قسم المعلومات الأساسية */}
          <div className="bg-white p-6 rounded-lg drop-shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
              معلومات أساسية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اسم المعلم
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={basicInfo.fullName}
                  onChange={(e) => handleChange(e, "basic", "fullName")}
                  placeholder="الاسم الرباعي للمعلم"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-6">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    الجنس
                  </span>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={basicInfo.gender === "male"}
                        onChange={(e) => handleChange(e, "basic", "gender")}
                        className="form-radio h-4 w-6 text-lime-700 focus:ring-lime-700"
                      />
                      <span className="ml-2">ذكر</span>
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={basicInfo.gender === "female"}
                        onChange={(e) => handleChange(e, "basic", "gender")}
                        className="form-radio h-4 w-6 text-lime-700 focus:ring-lime-700"
                      />
                      <span className="ml-2">أنثى</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    تاريخ الميلاد
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dob"
                      value={basicInfo.dateOfBirth}
                      onChange={(e) => handleChange(e, "basic", "dateOfBirth")}
                      placeholder="dd/mm/yyyy"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                    />
                  </div>
                </div>
              </div>

              {/* قسم رفع الملفات */}
              <div
                className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-lime-700 transition duration-200"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-lime-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v8a4 4 0 01-4 4H8a4 4 0 01-4-4v-8m8-4H8"
                    ></path>
                  </svg>
                  <p className="mt-4 text-sm text-gray-500">
                    قم بإسقاط ملفك هنا
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="mt-4 px-4 py-2 text-sm font-medium text-lime-700 bg-white border border-lime-700 rounded-md hover:bg-lime-50 transition duration-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  اختار ملف
                </button>
                {basicInfo.files.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-600">
                    {basicInfo.files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* قسم التفاصيل المهنية */}
          <div className="bg-white p-6 rounded-lg drop-shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
              التفاصيل المهنية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
              <div>
                <label
                  htmlFor="specialtyId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  التخصص
                </label>
                <select
                  id="specialtyId"
                  value={professionalInfo.specialtyId}
                  onChange={(e) => handleChange(e, "professional", "specialtyId")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                >
                  <option value="">اختر التخصص</option>
                  {data?.specialties?.map((s) => (
                    <option key={s.SpecialtyId} value={String(s.SpecialtyId)}>
                      {s.SpecialtyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="qualification"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  المؤهل
                </label>
                <select
                  id="qualification"
                  value={professionalInfo.qualification}
                  onChange={(e) => handleChange(e, "professional", "qualification")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                >
                  <option value="">اختر المؤهل</option>
                  {data?.specialties?.map((s) => (
                    <option key={s.SpecialtyId} value={String(s.Qualification)}>
                      {s.Qualification}
                    </option>
                  ))}
                  {/* <option value="دبلوم">دبلوم</option>
                  <option value="بكالوريوس">بكالوريوس</option>
                  <option value="ماجستير">ماجستير</option>
                  <option value="دكتوراه">دكتوراه</option> */}
                </select>
              </div>
              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الراتب (بالريال)
                </label>
                <input
                  type="number"
                  id="salary"
                  value={professionalInfo.salary}
                  onChange={(e) => handleChange(e, "professional", "salary")}
                  placeholder="مثال: 1500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                  min={0}
                />
              </div>
              {/* <div>
                <label
                  htmlFor="dateOfJoining"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  تاريخ الانضمام
                </label>
                <input
                  type="date"
                  id="dateOfJoining"
                  value={professionalInfo.dateOfJoining}
                  onChange={(e) =>
                    handleChange(e, "professional", "dateOfJoining")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div> */}
            </div>
          </div>
        </div>

        {/* العمود الأيسر */}
        <div className="space-y-8">
          {/* قسم تفاصيل الدخول/الحساب */}
          <div className="bg-white p-6 rounded-lg drop-shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
              تفاصيل الدخول/الحساب
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-6">
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    حالة الحساب
                  </span>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center text-gray-700 pl-10">
                      <input
                        type="radio"
                        name="isActive"
                        value="inactive"
                        checked={loginDetails.isActive === false}
                        onChange={() => setLoginDetails({ ...loginDetails, isActive: false })}
                        className="form-radio h-4 w-6 text-lime-700 focus:ring-lime-700"
                      />
                      <span className="ml-2 ">غير مفعل</span>
                    </label>
                    <label className="flex items-center text-gray-700">
                      <input
                        type="radio"
                        name="isActive"
                        value="active"
                        checked={loginDetails.isActive === true}
                        onChange={() => setLoginDetails({ ...loginDetails, isActive: true })}
                        className="form-radio h-4 w-6 text-lime-700 focus:ring-lime-700"
                      />
                      <span className="ml-2">مفعل</span>
                    </label>
                  </div>
                </div>
              </div>

             
                
              </div>
            </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  كلمة المرور
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginDetails.password}
                  onChange={(e) => handleChange(e, "login", "password")}
                  placeholder="كلمة المرور"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
            </div>
            {/* قسم معلومات الاتصال */}
          <div className="bg-white p-6 rounded-lg drop-shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
              معلومات الاتصال
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) => handleChange(e, "contact", "phone")}
                  placeholder="رقم التواصل"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  value={contactInfo.email}
                  onChange={(e) => handleChange(e, "contact", "email")}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
            </div>
            <div className="mt-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                العنوان
              </label>
              <input
                type="text"
                id="address"
                value={contactInfo.address}
                onChange={(e) => handleChange(e, "contact", "address")}
                placeholder="الحي والشارع"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
              />
            </div>
          </div>
          </div>

          
        </div>
      </div>
    
  );
};

export default App;
