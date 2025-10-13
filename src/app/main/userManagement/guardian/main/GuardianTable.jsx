"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { getGuardians, deleteGuardian } from "@/lib/Dia-api";

// 1. استيراد ملف JSON
// import guardiansData from "../../../../../data/guardian.json"; // تأكد من المسار الصحيح لملف JSON

// const guardiansData = () =>{

// }

const GuardianTable = () => {
  const [guardians, setGuardians] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  useEffect(() => {
    // console.log("👀 بيانات API:", guardians);
    getGuardians().then(setGuardians).catch(console.error);
  }, []);
  const router = useRouter();
  // 🚀 2. منطق تصفية البيانات
  const filteredGuardians = (guardians ?? []).filter((guardian) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = guardian.userName?.toLowerCase().includes(term);
    const emailMatch = guardian.email?.toLowerCase().includes(term);
    const phoneMatch = guardian.phone?.includes(term); 

    // البحث في الاسم أو البريد الإلكتروني أو رقم الهاتف
    return nameMatch || emailMatch || phoneMatch;
  });
  const TABLE_HEAD = [
    "الاسم",
    "البريد الإلكتروني",
    "التلفون",
    "حالة الحساب",
    "نوع العلاقة",
    "تعديل",
    "حذف",
  ];

  const renderIsActive = (isActive) => {
    // نحول أي نوع إلى قيمة منطقية (Boolean)
    const isActivated =
      isActive === true ||
      isActive === 1 ||
      isActive === "1" ||
      isActive === "true" ||
      isActive === "مفعل";

    // نحدد النص حسب الحالة
    const statusText = isActivated ? "مفعل" : "غير مفعل";

    // نحدد الألوان حسب الحالة
    const isActiveClasses = isActivated
      ? "text-green-900 bg-green-500/20"
      : "text-red-900 bg-red-500/20";

    // نعرض العنصر
    return (
      <div className="flex justify-center">
        <div className="w-max">
          <div
            className={`px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${isActiveClasses}`}
          >
            <span>{statusText}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderActionButton = (iconPath, action, guardian) => {
    const handleClick = async () => {
      if (action === "Edit") {
        // localStorage.setItem("editingGuardian", JSON.stringify(guardian));
        const encodedData = encodeURIComponent(JSON.stringify(guardian));
        router.push(
          `/main/userManagement/guardian/edit?id=${guardian.id}&data=${encodedData}`
        );
      } else if (action === "Delete") {
        try {
          console.log("🧩 Guardian Object:", guardian);
          await deleteGuardian(guardian); // ✅ لأنه رقم
          alert("✅ تم حذف ولي الأمر بنجاح");
          router.refresh();
        } catch (err) {
          console.error("❌ فشل الحذف:", err);
          alert("حدث خطأ أثناء الحذف.");
        }
      }
    };

    return (
      <button
        className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        onClick={handleClick}
      >
        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            class="w-4 h-4"
          >
            <path d={iconPath}></path>
          </svg>
        </span>
      </button>
    );
  };

  const editIconPath =
    "M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z";
  const deleteIconPath =
    "M5.25 5.25a.75.75 0 01.75-.75h12a.75.75 0 01.75.75v.75H5.25v-.75zM6 7.25v11.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75V7.25H6zm3.25 2a.75.75 0 011.5 0v7a.75.75 0 01-1.5 0v-7zm4.5 0a.75.75 0 011.5 0v7a.75.75 0 01-1.5 0v-7z";

  return (
    <div dir="rtl">
      <div className="hover:shadow-lg hover:shadow-gray-900/20 relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
          <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
            <div>
              <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                جدول أولياء الأمور
              </h5>
            </div>
            {/* ... الكود الخاص بالبحث وزر إضافة ولي أمر جديد (يبقى كما هو) ... */}
            <div className="flex w-full gap-2 shrink-0 md:w-max ">
              <div className="w-full md:w-72 ">
                <div class="relative h-10 w-full max-w-sm min-w-[200px]">
                  <div class="relative">
                    <input
                      // 🚀 ربط قيمة الإدخال بحالة searchTerm
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      class="w-full bg-transparent placeholder:text-slate-400 text-lime-900 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-lime-900 hover:border-slate-300 shadow-sm focus:shadow font-bold"
                      placeholder="البحث عن ولي أمر"
                    />
                    <button
                      class="absolute top-1 right-1 flex items-center rounded bg-lime-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-lime-900 focus:shadow-none active:bg-lime-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-4 h-5"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="w-full md:w-72">
                <div className="relative h-10 w-full min-w-[200px] hover:shadow-lg hover:shadow-gray-900/20">
                  <div className="absolute grid w-5 h-5 top-2/4 left-3 -translate-y-2/4 place-items-center text-blue-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700 outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" "
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    بحث
                  </label>
                </div>
              </div> */}
              <Link href="../guardian/edit">
                <button
                  className="flex select-none items-center gap-3 rounded-lg bg-lime-900 py-3 px-5 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  إضافة ولي أمر جديد
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="p-6 px-0 overflow-scroll">
          <table className="w-full text-center table-auto min-w-max">
            <thead>
              <tr>
                {/* 3. تكرار رؤوس الأعمدة باستخدام بيانات رأس الجدول (اختياري) */}
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50 "
                  >
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      {head}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 4. تكرار صفوف الجدول باستخدام دالة map على بيانات JSON */}
              {/* 🚀 4. استخدام قائمة أولياء الأمور المُصفاة (filteredGuardians) */}
              {(filteredGuardians ?? []).map((guardian) => { // <-- تم تغييرها إلى filteredGuardians
                const { id, userName, email, phone, isActive, relationType } =
                  guardian;
                return (
                  <tr key={id}>
                    {/* عمود الاسم */}
                    <td className="p-4 border-b border-blue-gray-50 text-center">
                      <p className="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900">
                        {userName}
                      </p>
                    </td>
                    {/* عمود البريد الإلكتروني */}
                    <td className="p-4 border-b border-blue-gray-50 text-center">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {email}
                      </p>
                    </td>
                    {/* عمود التلفون */}
                    <td className="p-4 border-b border-blue-gray-50 text-center">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {phone}
                      </p>
                    </td>
                    {/* عمود حالة الحساب */}
                    <td className="p-4 border-b border-blue-gray-50">
                      {renderIsActive(isActive)}
                    </td>
                    {/* عمود نوع العلاقة */}
                    <td className="p-4 border-b border-blue-gray-50 text-center">
                      <div className="flex flex-col">
                        {relationType?.name ?? "غير معروف"}
                      </div>
                    </td>
                    {/* عمود التعديل */}
                    <td className="p-4 border-b border-blue-gray-50 text-center">
                      {renderActionButton(editIconPath, "Edit", guardian)}
                    </td>
                    {/* عمود الحذف */}
                    <td className="p-4 border-b border-blue-gray-50 text-center">
                      {renderActionButton(deleteIconPath, "Delete", id)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuardianTable;
