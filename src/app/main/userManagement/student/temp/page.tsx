const updateStudentPage = () => {
  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-3xl font-bold">تعديل على معلومات الطالب</h1>
        <div className="">
          <button className="p-2 m-2 bg-lime-700 font-bold text-lg hover:bg-lime-800 rounded-lg shadow-lg text-white">
            تعديل
          </button>
          <button className="p-2 m-2 bg-red-500 font-bold text-lg hover:bg-red-600 rounded-lg shadow-lg text-white">
            إلغاء
          </button>
          <button className="p-2 m-2 bg-gray-400 font-bold text-lg hover:bg-gray-500 rounded-lg shadow-lg text-black">
            إعادة
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="drop-shadow-lg bg-gray-50 rounded-lg p-6">
          <h1 className="text-xl font-semibold border-b pb-2 ">
            تعديل معلومات الطالب الأساسية
          </h1>
          <div className="flex">
            <div>
              <label className="block" htmlFor="studentName">
                اسم الطالب
              </label>
              <input type="text" placeholder="الاسم الرباعي للطالب" />
            </div>
            <div>
              <label className="block" htmlFor="studentName">
                اسم الطالب
              </label>
              <input type="text" placeholder="الاسم الرباعي للطالب" />
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default updateStudentPage;
