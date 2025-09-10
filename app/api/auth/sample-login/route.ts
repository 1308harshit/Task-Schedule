import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // For demo purposes, accept any password
    if (password !== "admin123" && password !== "dev123") {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Create a session that NextAuth.js will recognize
    const sessionToken = `demo-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Delete any existing sessions for this user first
    await prisma.session.deleteMany({
      where: { userId: user.id }
    })
    
    await prisma.session.create({
      data: {
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sessionToken: sessionToken
      }
    })

    // Set the session cookie with proper NextAuth.js format
    const cookieStore = await cookies()
    cookieStore.set('authjs.session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    })

    // Return success with redirect URL
    const redirectUrl = (user as any).role === "ADMIN" ? "/admin/dashboard" : "/developer/dashboard"
    return NextResponse.json({ success: true, redirectUrl })

  } catch (error) {
    console.error("Sample login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
