import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  // Redirect based on user role
  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard")
  } else {
    redirect("/developer/dashboard")
  }
}