import type { auth } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";

type Session = typeof auth.$Infer.Session;

export default async function authMiddleware(request: NextRequest) {
    const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
        baseURL: request.nextUrl.origin,
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    });
    const pathname = request.nextUrl.pathname;
    if (!session) {
        return NextResponse.redirect(new URL(`/sign-in?redirect-back=${pathname}`, request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/tasks/:path*", "/wallet/:path*", "/invite/:path*", "/packages/:path*"],
};
