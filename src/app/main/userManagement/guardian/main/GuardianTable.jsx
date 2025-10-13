"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { getGuardians } from "@/lib/Dia-api";

// 1. استيراد ملف JSON
// import guardiansData from "../../../../../data/guardian.json"; // تأكد من المسار الصحيح لملف JSON

// const guardiansData = () =>{

// }

const GuardianTable = () => {
  const [guardians, setGuardians] = useState([]);
  useEffect(() => {
    // console.log("👀 بيانات API:", guardians);
    getGuardians().then(setGuardians).catch(console.error);
  }, []);
  const router = useRouter();
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
    const handleClick = () => {
      if (action === "Edit") {
        // localStorage.setItem("editingGuardian", JSON.stringify(guardian));
        const encodedData = encodeURIComponent(JSON.stringify(guardian));
        router.push(
          `/main/userManagement/guardian/edit?id=${guardian.id}&data=${encodedData}`
        );
        // router.push(`/main/userManagement/guardian/edit?id=${guardian.id}`);
        // 1. تحديد مسار التعديل مع تمرير مُعرِّف ولي الأمر
        // const editUrl = `../guardian/edit?id=${id}`;
        // router.push(`/guardians/add?id=${guardian.id}`, {
        //   state: { guardian },});
        // 2. استخدام router.push للتوجيه
        // router.push(editUrl);
        // editbyid =
      } else {
        console.log(`${action} clicked`);
      }
    };
    // const handleClick = () => {
    //   if (action === "edit") {
    //     <Link href="../guardian/edit"></Link> // 👈 استدعاء دالة فتح الرابط
    //   } else if (action === "delete") {
    //     console.log("Delete");
    //     // هنا يبقى منطق الحذف
    //   }
    // يمكنك إضافة منطق للمناداة على دالة عند الضغط على الزر (مثال: onDelete, onEdit)
    // const handleClick = () => {
    //   console.log(`${action} clicked`);
    //   // هنا يمكنك استدعاء دوال التعديل أو الحذف
    // };

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
              <div className="w-full md:w-72">
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
              </div>
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
              {(guardians ?? []).map((guardian) => {
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