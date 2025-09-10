import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create user (new users are developers by default - role and isActive are set by default in schema)
    const user = await prisma.user.create({
      data: {
        name,
        email
      }
    })

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

    // Return success with redirect URL (new users go to developer dashboard)
    const redirectUrl = "/developer/dashboard"
    return NextResponse.json({ 
      success: true, 
      redirectUrl,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: (user as any).role
      }
    })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
