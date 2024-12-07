import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  console.log("ssssssssss");
  const session = request.cookies.get("access_token");

  console.log("session", session);
  const AuthRoutes = ["/auth"];
  const privateRoute = ["/gallery"];
  console.log("AuthRoutes", AuthRoutes);

  const currentPath = request.nextUrl.pathname;

  const path = AuthRoutes.includes(currentPath);
  if (session && path) {
    return NextResponse.redirect(new URL("/home", request.url));
  } else if (!session && privateRoute.includes(currentPath)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|favicon.ico|login|).*)",
    "/auth",
    "/",
    "/gallery",
  ],
};
