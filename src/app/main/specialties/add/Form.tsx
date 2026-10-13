"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Specialty, SpecialtyCreationPayload, SpecialtyUpdatePayload } from "@/types/specialty";
import { addSpecialty, updateSpecialty } from "@/lib/api";

type SpecialtyAnalytics = {
  specialties: Specialty[];
  totalSpecialties: number;
  specialtiesWithTeachers: (Specialty & { teacherCount: number })[];
  totalTeachers: number;
};

interface FormProps {
  data: SpecialtyAnalytics;
}

const App: React.FC<FormProps> = ({ data }) => {
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const idParam = searchParams.get("id");
  const selectedSpecialtyId = useMemo(() => {
    if (!idParam) return null;
    const parsed = Number(idParam);
    return Number.isFinite(parsed) ? parsed : null;
  }, [idParam]);
  
  const isEditMode = Boolean(selectedSpecialtyId);

  // المعلّم المحدد في وضع التعديل
  const selectedSpecialty = useMemo(() => {
    if (!selectedSpecialtyId) return undefined;
    return data?.specialties?.find((s) => s.id === selectedSpecialtyId);
  }, [data, selectedSpecialtyId]);

  // تعبئة الحقول عند وضع التعديل
  useEffect(() => {
    if (!selectedSpecialty) return;
    setName(selectedSpecialty.name || "");
    setQualification(selectedSpecialty.qualification || "");
  }, [selectedSpecialty]);

  // معالجة إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
  
    if (!name.trim() || !qualification.trim()) {
      setMessage({ type: "error", text: "الرجاء تعبئة جميع الحقول." });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    
    try {
      if (isEditMode && selectedSpecialtyId) {
        const updatePayload: SpecialtyUpdatePayload = {
          id: selectedSpecialtyId,
          name: name.trim(),
          qualification: qualification.trim()
        };
        const updated = await updateSpecialty(updatePayload);
        setMessage({
          type: "success",
          text: `تم تحديث التخصص ${updated.name || ''} بنجاح! ✅`,
        });
        
        setTimeout(() => {
          router.push('/main/specialties/main');
        }, 1500);
        
      } else {
        const payload: SpecialtyCreationPayload = {
          name: name.trim(),
          qualification: qualification.trim()
        };
        
        const addedSpecialty = await addSpecialty(payload);
        setMessage({ 
          type: "success", 
          text: `تم إضافة التخصص ${addedSpecialty.name || 'الجديد'} بنجاح! 👋` 
        });
        setName("");
        setQualification("");
        
        setTimeout(() => {
          router.push('/main/specialties/main');
        }, 2000);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء الاتصال بالـ API.';
      setMessage({ type: "error", text: `فشل الحفظ: ${errorMessage}` });
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setQualification("");
    setMessage(null);
  };

  return (
    <div dir="rtl" className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? "تعديل التخصص" : "إضافة تخصص جديد"}</h1>
        <div className="space-x-4 space-x-reverse">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 text-white font-semibold bg-lime-700 rounded-lg hover:bg-lime-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? "جاري الحفظ..." : (isEditMode ? "تحديث" : "حفظ")}
          </button>
          <Link href="/main/specialties/main">
            <button className="px-6 py-2 text-gray-200 font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
              إلغاء
            </button>
          </Link>
          <button
            onClick={handleReset}
            className="px-6 py-2 text-gray-600 font-semibold bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            إعادة
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg drop-shadow-lg z-50 text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <p>{message.text}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg drop-shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
            معلومات التخصص
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                اسم التخصص
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: رياضيات, لغة عربية"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-700"
              />
            </div>
            
            <div>
              <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                المؤهل المطلوب
              </label>
              <input
                type="text"
                id="qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="مثال: بكالوريوس, ماجستير"
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
