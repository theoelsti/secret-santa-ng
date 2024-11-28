import { NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export function middleware(request) {
  // Récupérer le cookie admin_session
  const adminSession = request.cookies.get("admin_session")?.value;

  // Vérifier si le cookie est valide
  if (adminSession === ADMIN_TOKEN) {
    return NextResponse.next(); // Continuer vers la route API
  }

  // Si le token est invalide ou absent, renvoyer une erreur
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Appliquer le middleware uniquement aux routes /api/*
export const config = {
  matcher: "/api/admin/:path*", // Vérifie toutes les routes sous /api/
};
