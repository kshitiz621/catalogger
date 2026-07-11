import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;
    const status = req.nextauth.token?.status;

    if (status === "SUSPENDED") {
      // Redirect to a dedicated suspended page or login with error. Using login for now.
      return NextResponse.redirect(new URL("/login?error=suspended", req.url));
    }

    if (pathname.startsWith("/platform")) {
      // Allow /platform/login to bypass role check if handled below, but NextAuth already requires token for everything in matcher unless excluded.
      // Wait, we can't easily exclude just /platform/login from matcher if we want NextAuth to handle it, but we can allow if it's the login page.
      if (pathname === "/platform/login") {
        if (role === "SUPER_ADMIN") {
          return NextResponse.redirect(new URL("/platform/dashboard", req.url));
        }
        return NextResponse.next();
      }

      if (role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (pathname.startsWith("/dashboard")) {
      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/platform/dashboard", req.url));
      }
      if (role !== "SELLER") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        // /platform/login doesn't require a token to view
        if (pathname === "/platform/login") {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/platform/:path*"],
};
