import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import backendAxios from "./backendAxios";

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await backendAxios.post<AuthResponse>("/auth/signin", {
            email: credentials?.username,
            password: credentials?.password,
          });

          const data = response.data.data;

          if (data && data.accessToken && data.user) {
            if (data.user.role !== "admin") {
              throw new Error("คุณไม่มีสิทธิ์การใช้งานในส่วนของผู้ดูแลระบบ");
            }
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.email,
              role: data.user.role,
              accessToken: data.accessToken,
            };
          }
          return null;
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } }; message?: string };
          console.error("Auth signin error:", err.response?.data || err.message);
          throw new Error(err.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { role: string; accessToken: string };
        token.role = u.role;
        token.accessToken = u.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const customSession = session as unknown as {
          user: { name?: string | null; email?: string | null; image?: string | null; role: string; accessToken: string };
        };
        customSession.user.role = (token.role as string) || "admin";
        customSession.user.accessToken = (token.accessToken as string) || "";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-blogs-token-key-2026",
};
