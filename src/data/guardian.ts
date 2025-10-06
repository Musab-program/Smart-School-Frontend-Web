import { NextResponse } from "next/server";

export async function GET() {
  const guardian = [
  {
    id: "m5gr84i9",
    name: "علي",
    status: "نشط",
    email: "ken99@example.com",
    RelationType: "أب"
  },
  {
    id: "3u1reuv4",
    name: "سام",
    status: "نشط",
    email: "Abe45@example.com",
    RelationType: "أب"
  },
  {
    id: "derv1ws0",
    name: "أمل",
    status: "نشط",
    email: "Monserrat44@example.com",
    RelationType: "أم"
  },
  {
    id: "5kma53ae",
    name: "سمر",
    status: "نشط",
    email: "Silas22@example.com",
    RelationType: "أم"
  },
  {
    id: "bhqecj4p",
    name: "خالد",
    status: "خامل",
    email: "carmella@example.com",
    RelationType: "أب"
  },
];

  return NextResponse.json(guardian);
}
