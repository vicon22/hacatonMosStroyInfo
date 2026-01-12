import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getById } from "./entities/user/services";
import { selfId } from "./entities/user/constants";
import { ApiClient } from "./shared/api";

const publicRoutes = [
  "/api",
  "/_next",
  "/media",
  "/.well-known/appspecific/com.chrome.devtools.json",
  "/enc.js",
  "/favicon.ico",
];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  if (isPublicRoute) {
    return NextResponse.next();
  } else {
    try {
      ApiClient.instance.addHeaders({
        Cookie: (await cookies()).toString(),
        "x-request-id": String((await headers()).get("x-request-id")),
      });

      const selfData = await getById(selfId);

      if (!selfData.email) {
        if (path !== "/login") {
          return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
      } else {
        if (path === "/login") {
          return NextResponse.redirect(new URL("/", req.nextUrl));
        }
      }
    } catch {
      if (path !== "/login") {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
      }
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/*).*)"],
};
