import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/", // We use the home page as a combined landing/login
    },
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isApiRoute = nextUrl.pathname.startsWith("/api");
            const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/api/auth");

            if (isLoggedIn) return true;
            if (isPublicRoute) return true;

            return false; // Redirect to login for other routes
        },
    },
    providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
