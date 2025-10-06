"use client";

import Link from "next/link";

import { useRouter } from 'next/navigation';

// 1. استيراد ملف JSON
import guardiansData from "../../../../../data/guardian.json"; // تأكد من المسار الصحيح لملف JSON

const GuardianTable = () => {
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

  const renderStatus = (status) => {
    const isActivated = status === "مفعل";
    const statusClasses = isActivated
      ? "text-green-900 bg-green-500/20"
      : "text-red-900 bg-red-500/20"; // مثال لإضافة حالة "غير مفعل" باللون الأحمر

    return (
      <div className="flex justify-center">
        <div class="w-max">
          <div
            class={`px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap ${statusClasses}`}
          >
            <span class="">{status}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderActionButton = (iconPath, action, gid) => {
    const handleClick = () => {
      if (action === "Edit") {
        // 1. تحديد مسار التعديل مع تمرير مُعرِّف ولي الأمر
        const editUrl = `../guardian/edit?id=${gid}`;
        // 2. استخدام router.push للتوجيه
        router.push(editUrl);
        // editbyid = 
    } else {
        console.log(`${action} clicked`);
    }}
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
        class="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        onClick={handleClick}
      >
        <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
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
      <div class="hover:shadow-lg hover:shadow-gray-900/20 relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div class="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
          <div class="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
            <div>
              <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                جدول ولي الأمر
              </h5>
            </div>
            {/* ... الكود الخاص بالبحث وزر إضافة ولي أمر جديد (يبقى كما هو) ... */}
            <div class="flex w-full gap-2 shrink-0 md:w-max ">
              <div class="w-full md:w-72">
                <div class="relative h-10 w-full min-w-[200px] hover:shadow-lg hover:shadow-gray-900/20">
                  <div class="absolute grid w-5 h-5 top-2/4 left-3 -translate-y-2/4 place-items-center text-blue-gray-500">
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
                    class="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700 outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" "
                  />
                  <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    بحث
                  </label>
                </div>
              </div>
              <Link href="../guardian/edit">
                <button
                  class="flex select-none items-center gap-3 rounded-lg bg-lime-900 py-3 px-5 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  إضافة ولي أمر جديد
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div class="p-6 px-0 overflow-scroll">
          <table class="w-full text-center table-auto min-w-max">
            <thead>
              <tr>
                {/* 3. تكرار رؤوس الأعمدة باستخدام بيانات رأس الجدول (اختياري) */}
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50 "
                  >
                    <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      {head}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 4. تكرار صفوف الجدول باستخدام دالة map على بيانات JSON */}
              {guardiansData.map(
                ({ id, name, email, phone, status, relationship }) => (
                  <tr key={id}>
                    {/* عمود الاسم */}
                    <td class="p-4 border-b border-blue-gray-50 text-center">
                      <p class="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900">
                        {name}
                      </p>
                    </td>
                    {/* عمود البريد الإلكتروني */}
                    <td class="p-4 border-b border-blue-gray-50 text-center">
                      <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {email}
                      </p>
                    </td>
                    {/* عمود التلفون */}
                    <td class="p-4 border-b border-blue-gray-50 text-center">
                      <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {phone}
                      </p>
                    </td>
                    {/* عمود حالة الحساب */}
                    <td class="p-4 border-b border-blue-gray-50">
                      {renderStatus(status)}
                    </td>
                    {/* عمود نوع العلاقة */}
                    <td class="p-4 border-b border-blue-gray-50 text-center">
                      <div class="flex flex-col">{relationship}</div>
                    </td>
                    {/* عمود التعديل */}
                    <td class="p-4 border-b border-blue-gray-50 text-center">
                      {renderActionButton(editIconPath, "Edit" , id)}
                    </td>
                    {/* عمود الحذف */}
                    <td class="p-4 border-b border-blue-gray-50 text-center">
                      {renderActionButton(deleteIconPath, "Delete" , id)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuardianTable;

// const GuardianTable = () => {
//   return (
//     <div dir="rtl">
//       <div
//         class="hover:shadow-lg hover:shadow-gray-900/20 relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border"
//       >
//         <div class="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
//           <div class="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
//             <div>
//               <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
//                 جدول ولي الأمر
//               </h5>
//             </div>
//             <div class="flex w-full gap-2 shrink-0 md:w-max ">
//               <div class="w-full md:w-72">
//                 <div class="relative h-10 w-full min-w-[200px] hover:shadow-lg hover:shadow-gray-900/20">
//                   <div class="absolute grid w-5 h-5 top-2/4 left-3 -translate-y-2/4 place-items-center text-blue-gray-500">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke-width="1.5"
//                       stroke="currentColor"
//                       aria-hidden="true"
//                       class="w-5 h-5"
//                     >
//                       <path
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
//                       ></path>
//                     </svg>
//                   </div>
//                   <input
//                     class="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
//                     placeholder=" "
//                   />
//                   <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
//                     بحث
//                   </label>
//                 </div>
//               </div>
//               <button
//                 class="flex select-none items-center gap-3 rounded-lg bg-lime-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
//                 type="button"
//               >
//                 إضافة ولي أمر جديد
//               </button>
//             </div>
//           </div>
//         </div>
//         <div class="p-6 px-0 overflow-scroll">
//           <table class="w-full text-center table-auto min-w-max">
//             <thead>
//               <tr>
//                 <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50 ">
//                   <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
//                     الاسم
//                   </p>
//                 </th>
//                 <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
//                   <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
//                     البريد الإلكتروني
//                   </p>
//                 </th>
//                 <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
//                   <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
//                     التلفون
//                   </p>
//                 </th>
//                 <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
//                   <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
//                     حالة الحساب
//                   </p>
//                 </th>
//                 <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
//                   <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
//                     نوع العلاقة
//                   </p>
//                 </th>
//                 <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
//                   <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"></p>
//                   <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
//                     تعديل
//                   </p>
//                 </th>
//                 <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
//                   <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
//                     حذف
//                   </p>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td class="p-4 border-b border-blue-gray-50 text-center">
//                   <p class="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900">
//                     علي سليم أحمد محمد
//                   </p>
//                 </td>
//                 <td class="p-4 border-b border-blue-gray-50 text-center">
//                   <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
//                     ali@gmail.com
//                   </p>
//                 </td>
//                 <td class="p-4 border-b border-blue-gray-50 text-center">
//                   <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
//                     0599999999
//                   </p>
//                 </td>
//                 <td class="p-4 border-b border-blue-gray-50">
//                   <div className="flex justify-center">
//                     <div class="w-max">
//                       <div class="px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
//                         <span class="">مفعل</span>
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//                 <td class="p-4 border-b border-blue-gray-50 text-center">
//                   <div class="flex flex-col">أب</div>
//                 </td>
//                 <td class="p-4 border-b border-blue-gray-50 text-center">
//                   <button
//                     class="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
//                     type="button"
//                   >
//                     <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                         aria-hidden="true"
//                         class="w-4 h-4"
//                       >
//                         <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
//                       </svg>
//                     </span>
//                   </button>
//                 </td>
//                 <td class="p-4 border-b border-blue-gray-50 text-center">
//                   <button
//                     class="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
//                     type="button"
//                   >
//                     <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                         aria-hidden="true"
//                         class="w-6 h-5"
//                       >
//                         <path
//                           fill-rule="evenodd"
//                           d="M5.25 5.25a.75.75 0 01.75-.75h12a.75.75 0 01.75.75v.75H5.25v-.75zM6 7.25v11.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75V7.25H6zm3.25 2a.75.75 0 011.5 0v7a.75.75 0 01-1.5 0v-7zm4.5 0a.75.75 0 011.5 0v7a.75.75 0 01-1.5 0v-7z"
//                           clip-rule="evenodd"
//                         />
//                       </svg>
//                     </span>
//                   </button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuardianTable;
