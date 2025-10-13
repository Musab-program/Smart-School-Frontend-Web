import { NextResponse } from "next/server";

export async function GET() {
  try {
    const base = process.env.BACKEND_BASE_URL || "https://localhost:44363";
    const url = `${base}/api/Teachers/GetAllTeacher`;
    const resp = await fetch(url, { cache: "no-store" });

    const contentType = resp.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await resp.json() : await resp.text();

    if (!resp.ok) {
      return NextResponse.json(
        { message: body?.title || body?.detail || body?.message || body || "فشل في جلب بيانات المعلمين" },
        { status: resp.status }
      );
    }
    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}



