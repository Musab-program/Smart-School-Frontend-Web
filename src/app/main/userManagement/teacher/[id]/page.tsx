"use client";
import React, { useRef, useState } from "react";

// واجهات البيانات المحدثة للمعلم
type Gender = "male" | "female";

interface BasicInfo {
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  files: File[];
}

interface ProfessionalInfo {
  employeeId: string;
  designation: string;
  subject: string;
  qualifications: string;
  dateOfJoining: string;
}

interface LoginDetails {
  username: string;
  password: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  location: string;
  district: string;
  pincode: string;
  state: string;
}

interface AdditionalInfo {
  yearsOfExperience: number | string;
  specialRoles: string;
}

const App = () => {
  // حالات النموذج
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    firstName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: "",
    files: [],
  });

  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo>({
    employeeId: "",
    designation: "",
    subject: "",
    qualifications: "",
    dateOfJoining: "",
  });

  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    username: "",
    password: "",
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "",
    email: "",
    address: "",
    location: "",
    district: "",
    pincode: "",
    state: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    yearsOfExperience: "",
    specialRoles: "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    } else if (section === "additional") {
      setAdditionalInfo({ ...additionalInfo, [field]: nextValue as never });
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
      additionalInfo,
    });
    setMessage({ type: "success", text: "تم حفظ النموذج بنجاح!" });
  };

  // معالجة إعادة تعيين النموذج
  const handleReset = () => {
    setBasicInfo({
      firstName: "",
      lastName: "",
      gender: "male",
      dateOfBirth: "",
      files: [],
    });
    setProfessionalInfo({
      employeeId: "",
      designation: "",
      subject: "",
      qualifications: "",
      dateOfJoining: "",
    });
    setLoginDetails({
      username: "",
      password: "",
    });
    setContactInfo({
      phone: "",
      email: "",
      address: "",
      location: "",
      district: "",
      pincode: "",
      state: "",
    });
    setAdditionalInfo({
      yearsOfExperience: "",
      specialRoles: "",
    });
    setMessage(null);
  };

  return (
    <div dir="rtl" className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">إضافة معلم جديد</h1>
        <div className="space-x-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white font-semibold bg-lime-700 rounded-lg hover:bg-lime-800 transition-colors"
          >
            حفظ
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
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اسم المعلم
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={basicInfo.firstName}
                  onChange={(e) => handleChange(e, "basic", "firstName")}
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
                  htmlFor="employeeId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  رقم الموظف
                </label>
                <input
                  type="text"
                  id="employeeId"
                  value={professionalInfo.employeeId}
                  onChange={(e) =>
                    handleChange(e, "professional", "employeeId")
                  }
                  placeholder="رقم الموظف"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div>
                <label
                  htmlFor="designation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  المسمى الوظيفي
                </label>
                <input
                  type="text"
                  id="designation"
                  value={professionalInfo.designation}
                  onChange={(e) =>
                    handleChange(e, "professional", "designation")
                  }
                  placeholder="مثال: معلم صف، منسق"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  المادة
                </label>
                <input
                  type="text"
                  id="subject"
                  value={professionalInfo.subject}
                  onChange={(e) => handleChange(e, "professional", "subject")}
                  placeholder="مثال: الرياضيات، الفيزياء"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div>
                <label
                  htmlFor="qualifications"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  المؤهلات
                </label>
                <input
                  type="text"
                  id="qualifications"
                  value={professionalInfo.qualifications}
                  onChange={(e) =>
                    handleChange(e, "professional", "qualifications")
                  }
                  placeholder="مثال: بكالوريوس في التعليم"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div>
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
              </div>
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
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  id="username"
                  value={loginDetails.username}
                  onChange={(e) => handleChange(e, "login", "username")}
                  placeholder="اسم المستخدم"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                >
                  الموقع
                </label>
                <input
                  type="text"
                  id="location"
                  value={contactInfo.location}
                  onChange={(e) => handleChange(e, "contact", "location")}
                  placeholder="الموقع"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                >
                  المنطقة
                </label>
                <input
                  type="text"
                  id="district"
                  value={contactInfo.district}
                  onChange={(e) => handleChange(e, "contact", "district")}
                  placeholder="المنطقة"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                >
                  الرمز البريدي
                </label>
                <input
                  type="text"
                  id="pincode"
                  value={contactInfo.pincode}
                  onChange={(e) => handleChange(e, "contact", "pincode")}
                  placeholder="الرمز البريدي"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                >
                  الولاية/المحافظة
                </label>
                <input
                  type="text"
                  id="state"
                  value={contactInfo.state}
                  onChange={(e) => handleChange(e, "contact", "state")}
                  placeholder="الولاية/المحافظة"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
            </div>
          </div>

          {/* قسم معلومات إضافية */}
          <div className="bg-white p-6 rounded-lg drop-shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
              معلومات إضافية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="yearsOfExperience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  سنوات الخبرة
                </label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  value={additionalInfo.yearsOfExperience}
                  onChange={(e) =>
                    handleChange(e, "additional", "yearsOfExperience")
                  }
                  placeholder="عدد السنوات"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
              <div>
                <label
                  htmlFor="specialRoles"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  أدوار خاصة (إن وجدت)
                </label>
                <input
                  type="text"
                  id="specialRoles"
                  value={additionalInfo.specialRoles}
                  onChange={(e) =>
                    handleChange(e, "additional", "specialRoles")
                  }
                  placeholder="مثال: منسق قسم، مدرب"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
