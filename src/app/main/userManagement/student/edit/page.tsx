"use client";

import ClickSpark from "@/components/ClickSpark";
import React, { useRef, useState } from "react";

import { CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
type Gender = "male" | "female";

interface BasicInfo {
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  files: File[];
}

interface ParentDetails {
  fatherName: string;
  fatherContact: string;
  fatherOccupation: string;
  motherName: string;
  motherContact: string;
  annualIncome: string;
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
  isDayScholar: boolean;
  hasTransport: boolean;
}

const App = () => {
  // State for all form fields
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    firstName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: "",
    files: [],
  });

  const [parentDetails, setParentDetails] = useState<ParentDetails>({
    fatherName: "",
    fatherContact: "",
    fatherOccupation: "",
    motherName: "",
    motherContact: "",
    annualIncome: "",
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
    isDayScholar: true,
    hasTransport: true,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file drop and selection
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

  // Generic handler for all form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: "basic" | "parent" | "login" | "contact" | "additional",
    field: string
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const isCheckbox = (target as HTMLInputElement).type === "checkbox";
    const nextValue = isCheckbox
      ? (target as HTMLInputElement).checked
      : target.value;
    if (section === "basic") {
      setBasicInfo({ ...basicInfo, [field]: nextValue as never });
    } else if (section === "parent") {
      setParentDetails({ ...parentDetails, [field]: nextValue as never });
    } else if (section === "login") {
      setLoginDetails({ ...loginDetails, [field]: nextValue as never });
    } else if (section === "contact") {
      setContactInfo({ ...contactInfo, [field]: nextValue as never });
    } else if (section === "additional") {
      setAdditionalInfo({ ...additionalInfo, [field]: nextValue as never });
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Logic to save the form data
    console.log("تم إرسال البيانات:", {
      basicInfo,
      parentDetails,
      loginDetails,
      contactInfo,
      additionalInfo,
    });
    // Add logic here to send data to a backend or process it
    alert("تم حفظ النموذج! تحقق من وحدة التحكم للبيانات.");
  };

  // Reset form handler
  const handleReset = () => {
    setBasicInfo({
      firstName: "",
      lastName: "",
      gender: "male",
      dateOfBirth: "",
      files: [],
    });
    setParentDetails({
      fatherName: "",
      fatherContact: "",
      fatherOccupation: "",
      motherName: "",
      motherContact: "",
      annualIncome: "",
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
      isDayScholar: true,
      hasTransport: true,
    });
  };

  type CreateGuardianPayload = {
    fullName: string;
    phone: string;
    email?: string;
    relation: string;
    nationalId?: string;
    address?: string;
    notes?: string;
  };

  // export default function Page() {
  // const router = useRouter();
  const [, setSubmitting] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<CreateGuardianPayload>({
    fullName: "",
    phone: "",
    email: "",
    relation: "father",
    nationalId: "",
    address: "",
    notes: "",
  });

  const handleChangeParent =
    (field: keyof CreateGuardianPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  async function handleSubmitParent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.fullName.trim()) {
      setError("الاسم الكامل مطلوب");
      return;
    }
    if (!/^\+?\d{8,15}$/.test(form.phone.trim())) {
      setError("رقم الجوال غير صالح");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/guardians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "تعذر إضافة ولي الأمر");
      }

      setSuccess("تمت إضافة ولي الأمر بنجاح");
      setForm({
        fullName: "",
        phone: "",
        email: "",
        relation: "father",
        nationalId: "",
        address: "",
        notes: "",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div dir="rtl" className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">إضافة طالب جديد</h1>
        <div className="space-x-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white font-semibold bg-lime-700 rounded-lg hover:bg-lime-800 transition-colors"
          >
            <ClickSpark>حفظ</ClickSpark>
          </button>
          <button
            onClick={() => alert("تم الإلغاء.")}
            className="px-6 py-2 text-gray-200 font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 m-2 text-gray-600 font-semibold bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            إعادة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white p-6 rounded-lg drop-shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
              معلومات الطالب أساسية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اسم الطالب
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={basicInfo.firstName}
                  onChange={(e) => handleChange(e, "basic", "firstName")}
                  placeholder="الاسم الرباعي للطالب"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Gender and Date of Birth */}
              <div className="space-y-6">
                {/* Gender */}
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
                      <span className="ml-2">
                        <ClickSpark>ذكر</ClickSpark>
                      </span>
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

                {/* Date of Birth */}
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

                {/* Class and Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="class"
                      className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                    >
                      الصف
                    </label>
                    <select
                      id="class"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                    >
                      <option value="">الصف</option>
                      {/* Add options here */}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="section"
                      className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                    >
                      الشعبة
                    </label>
                    <select
                      id="section"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                    >
                      <option value="">الشعبة</option>
                      {/* Add options here */}
                    </select>
                  </div>
                </div>
              </div>

              {/* File Upload */}
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
            <div className="flex justify-between mt-4 max-w-6xl mx-auto">
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
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Login/Account Details Section */}
          <div className="bg-white p-6 rounded-lg drop-shadow-lg pb-15">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
              معلومات ولي الأمر
            </h3>
            <CardContent>
              <form onSubmit={handleSubmitParent} className="space-y-6">
                {/* الحقول في Grid متجاوبة */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      الاسم الكامل<span className="text-destructive"> *</span>
                    </Label>
                    <input
                      type="text"
                      id="fullName"
                      value={form.fullName}
                      onChange={handleChangeParent("fullName")}
                      placeholder="مثال: أحمد محمد عبدالله"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      رقم الجوال<span className="text-destructive"> *</span>
                    </Label>
                    <input
                      id="phone"
                      value={form.phone}
                      onChange={handleChangeParent("phone")}
                      placeholder="مثال: 9665xxxxxxxx"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                      inputMode="tel"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={form.email}
                      onChange={handleChangeParent("email")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                    />
                  </div>
                  <div className="space-y-2 focus:outline-none focus:ring-2 focus:ring-lime-700">
                    <Label>صلة القرابة</Label>
                    <Select
                      value={form.relation}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, relation: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر صلة القرابة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="father">أب</SelectItem>
                        <SelectItem value="mother">أم</SelectItem>
                        <SelectItem value="brother">أخ</SelectItem>
                        <SelectItem value="sister">أخت</SelectItem>
                        <SelectItem value="guardian">ولي أمر آخر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">رقم الهوية</Label>
                    <input
                      id="nationalId"
                      placeholder="رقم الهوية الوطنية/الإقامة"
                      value={form.nationalId}
                      onChange={handleChangeParent("nationalId")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <input
                      id="address"
                      placeholder="المدينة، الحي، الشارع"
                      value={form.address}
                      onChange={handleChangeParent("address")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
