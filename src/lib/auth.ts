import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "./db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email } as any);
        if (!user) return null;
        const isValid = await bcrypt.compare(
          (credentials.password as string) || "",
          user.password
        );
        if (!isValid) return null;
        return {
          id: (user as any)._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      const safeUser: Record<string, unknown> = {
        name: token.name,
        email: token.email,
        role: token.role,
        id: token.sub,
      };
      (session.user as Record<string, unknown>) = safeUser;
      return session;
    },
  },
  pages: {
    signIn: "/account/login",
  },
  session: {
    strategy: "jwt",
  },
});
