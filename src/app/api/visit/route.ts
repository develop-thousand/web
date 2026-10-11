import { NextRequest, NextResponse } from "next/server";
import { getVisitorPool } from "@/lib/visitor-db";

export const runtime = "nodejs";

const visitCookie = "thousand_visit";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return new Response(null, { status: 403 });
  }

  if (request.cookies.has(visitCookie)) {
    return new Response(null, { status: 204 });
  }

  try {
    await getVisitorPool().query(`
      insert into private.site_visit_counts (visit_date, visits)
      values ((now() at time zone 'Asia/Seoul')::date, 1)
      on conflict (visit_date)
      do update set visits = private.site_visit_counts.visits + 1
    `);
  } catch (error) {
    console.error("Visit tracking database query failed", error);
    return new Response(null, { status: 503 });
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(visitCookie, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
