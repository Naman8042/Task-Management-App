import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/userSchema";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

export const option: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const { email, password } = credentials as { email: string; password: string };

        const user = await User.findOne({ email });

        if (!user) {
          return null;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      const authUser = user as AuthUser; 
      token.id = authUser.id;
    }
    return token;
  },
  async session({ session, token }) {
    if (session?.user) {
      session.user.id = token.id as string;
    }
    return session;
  },
}
}