import { cookies } from "next/headers";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export async function POST(req) {
  const { token } = await req.json();

  if (token === ADMIN_TOKEN) {
    cookies().set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
    });
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false }, { status: 401 });
}

export async function GET() {
  const u_cookies = await cookies();
  const adminSession = u_cookies.get("admin_session");

  if (adminSession?.value === ADMIN_TOKEN) {
    return Response.json({ ok: true, authenticated: true });
  }

  return Response.json(
    { ok: false, authenticated: false, message: "Non autorisé" },
    { status: 401 }
  );
}
