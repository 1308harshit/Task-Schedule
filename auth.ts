import NextAuth from "next-auth"
import github from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [github],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // Get user role from database
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: { id: true, role: true, name: true, email: true, image: true }
        })
        
        if (dbUser) {
          session.user.id = dbUser.id.toString()
          session.user.role = dbUser.role
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Allow all sign-ins - let the adapter handle user creation
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "database",
  },
  events: {
    async createUser({ user }) {
      // Set default role for new users
      await prisma.user.update({
        where: { id: user.id },
        data: { role: UserRole.DEVELOPER }
      })
      console.log("New user created:", { email: user.email, role: UserRole.DEVELOPER })
    },
    async linkAccount({ user, account, profile }) {
      console.log("Account linked:", { user: user.email, provider: account.provider })
    }
  },
  debug: process.env.NODE_ENV === "development",
})