// File: components/tables/StudentsTable.js
"use client";

import Link from "next/link";
import ClickSpark from "@/components/ClickSpark";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { PlusIcon } from "lucide-react";

const TABLE_HEAD = ["الرقم", "اسم الطالب", "الصف", "الشعبة", "العنوان", "ولي الأمر", "رقم الهاتف", "تعديل", "حذف"];

const TABLE_ROWS = [
  {
    no: 1,
    name: "علي حمود",
    class: "12-A",
    division: "ا",
    address: "السنينة",
    parent: " حمود على ",
    phone: "773219299",
  },
  {
    no: 2,
    name: "علي حمود",
    class: "12-A",
    division: "ا",
    address: "السنينة",
    parent: " حمود على ",
    phone: "773219299",
  },
  {
    no: 3,
    name: "علي حمود",
    class: "12-A",
    division: "ا",
    address: "السنينة",
    parent: " حمود على ",
    phone: "773219299",
  },
  {
    no: 4,
    name: "علي حمود",
    class: "12-A",
    division: "ا",
    address: "السنينة",
    parent: " حمود على ",
    phone: "773219299",
  },
  {
    no: 5,
    name: "علي حمود",
    class: "12-A",
    division: "ا",
    address: "السنينة",
    parent: " حمود على ",
    phone: "773219299",
  },
];

export function TeacherTable() {
  
  return (
    <Card className="h-full w-full shadow-lg">
      <CardHeader floated={false} shadow={false} className="rounded-none bg-white">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex w-full shrink-0 gap-2 md:w-max p-3">
            <div className="w-full md:w-72 ">
              <Input
                label="بحث..."
                icon={<MagnifyingGlassIcon className="h-5 w-5 text-lime-700 mt-2.5" />}
                className="!border !border-lime-700 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10v rounded-2xl"
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <Button className="flex items-center gap-3 bg-lime-700 text-white" size="sm">
              {/* <ClickSpark> */}
                <Link href="/main/userManagement/teacher/edit">
              <div className="flex items-center gap-3 mt-0.5">
                  <PlusIcon strokeWidth={2} className="h-4 w-4" /> إضافة
                  </div>
                </Link>
              {/* </ClickSpark> */}
            </Button>
          </div> 
          <div className="p-3 text-right">
            <Typography variant="h5" color="blue-gray">
              قائمة الطلاب
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              عرض معلومات جميع الطلاب
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0 bg-white">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}{" "}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(
              (
                {
                  no,
                  name,
                  class: studentClass,
                  division,
                  address,
                  parent,
                  phone,
                },
                index
              ) => {
                const isEvenRow = index % 2 === 0;
                const rowClasses = `p-4 border-b border-blue-gray-50 ${isEvenRow ? "bg-white" : "bg-gray-100"}`;

                return (
                  <tr key={no}>
                    <td className={rowClasses}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {no}
                      </Typography>
                    </td>
                    <td className={rowClasses}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {name}
                      </Typography>
                    </td>
                    <td className={rowClasses}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {studentClass}
                      </Typography>
                    </td>
                    <td className={rowClasses}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {division}
                      </Typography>
                    </td>
                    <td className={rowClasses}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {address}
                      </Typography>
                    </td>
                    <td className={rowClasses}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {parent}
                      </Typography>
                    </td>
                    <td className={rowClasses}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {phone}
                      </Typography>
                    </td>
                    <td className={rowClasses}>
                      <Tooltip content="تعديل">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td className={rowClasses}>
                      <Tooltip content="حذف">
                        <IconButton variant="text">
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4 bg-white">
        <Typography variant="small" color="blue-gray" className="font-normal">
          صفحة 1 من 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            السابق
          </Button>
          <Button variant="outlined" size="sm">
            التالي
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}