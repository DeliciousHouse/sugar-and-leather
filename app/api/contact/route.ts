import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  console.log("Contact form submission:", body);
  return NextResponse.json({ success: true });
}
