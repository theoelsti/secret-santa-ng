import { NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export function middleware(request) {
  const adminSession = request.cookies.get("admin_session")?.value;

  if (adminSession === ADMIN_TOKEN) {
    return NextResponse.next();
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const config = {
  matcher: "/api/admin/:path*",
};
