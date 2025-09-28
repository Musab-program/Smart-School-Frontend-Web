"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Users, UserCheck, Banknote } from "lucide-react";

export function DashboardCards() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // استخدام API تجريبي: JSONPlaceholder
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();
        
        // تعديل البيانات لتناسب تصميم الواجهة
        const formattedStats = [
          { icon: <Users className="h-6 w-6 text-white" />, label: "إجمالي ", value: data.length, color: "bg-blue-500" },
          { icon: <UserCheck className="h-6 w-6 text-white" />, label: "مستخدمين متاحين", value: data.length > 5 ? 'نعم' : 'لا', color: "bg-green-500" },
          { icon: <Banknote className="h-6 w-6 text-white" />, label: "رسوم تجريبية", value: "999", color: "bg-orange-500" },
        ];

        setStats(formattedStats);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Typography>جاري التحميل...</Typography>;
  }

  if (error) {
    return <Typography color="red">خطأ: {error}</Typography>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="font-semibold">
                {stat.label}
              </Typography>
              <Typography variant="h4" color="gray" className="font-bold">
                {stat.value}
              </Typography>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}