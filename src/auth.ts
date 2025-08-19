import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"


// Extend the User type to include 'role'
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    }
  }

  interface User {
    role?: string | null;    // 👈 add role to User
  }

}

declare module "next-auth" {
  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;   // 👈 added role
  }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        salt: { label: "Salt", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.id || !credentials?.salt) return null;
        const user = await prisma.user.findUnique({
          where: { id: credentials.id as string, salt: credentials.salt as string },
        });
        if (!user) return null;
        return user;
      },
    }),
  ],
  callbacks: {

    async jwt({ token, user, trigger, session }) {

      console.log("jwt trigger:",trigger);
      if (trigger === "update") {
        
        token=  { ...token, ...session.user };
        console.log("updated token: ", session.user);
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
        
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (dbUser && dbUser.role) {
          token.role = dbUser.role;
        }
      } 

      // console.log("jwt callback: ", token);

      return token;
    },

    async session({ session, token, trigger}) {
      console.log("session: ",session);
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.image = token.image as string;
      session.user.role = token.role as string;

      console.log("trigger:",trigger);

      console.log("session after db check on role: ", session);

      return session;
    },

    async signIn({ user, account, profile, email }) {

      console.log("entering google oauth");
      // If it's a new user and no role is set
      const existingUser = await prisma.user.findUnique({ where: { email: user.email! } });

      if(existingUser?.role) user.role = existingUser.role;

      console.log("existing user:",existingUser);

      return true; // allow login normally
    },

  },
  session: {
    strategy: "jwt",
  },
});
