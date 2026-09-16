import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // Without this, Auth.js can fall back to an incorrect inferred host (e.g. localhost) when
  // building redirect URLs behind Vercel's proxy. Safe here since the app only runs on hosts we
  // control (local dev + this Vercel project).
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/admin/dashboard", request.nextUrl));
        return true;
      }

      if (isAdminRoute) return isLoggedIn;

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // populated in auth.ts (Credentials provider needs bcrypt, which the edge/proxy bundle can't use)
} satisfies NextAuthConfig;
