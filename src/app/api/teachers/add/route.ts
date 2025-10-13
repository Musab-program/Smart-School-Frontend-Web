import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const base = process.env.BACKEND_BASE_URL || "https://localhost:44363";
    const url = `${base}/api/Teachers/AddTeacher`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const contentType = resp.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await resp.json() : await resp.text();

    if (!resp.ok) {
      return NextResponse.json(
        { message: body?.title || body?.detail || body?.message || body || "فشل في إضافة المعلم" },
        { status: resp.status }
      );
    }

    return NextResponse.json(body, { status: resp.status });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}



