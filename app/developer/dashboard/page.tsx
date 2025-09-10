import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"
import DeveloperDashboard from "@/components/developer/DeveloperDashboard"

export default async function DeveloperDashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== UserRole.DEVELOPER) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
              <p className="text-gray-600">View assigned tasks and track your progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {session.user.name || session.user.email}!
              </span>
              <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Developer
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <DeveloperDashboard />
        </Suspense>
      </main>
    </div>
  )
}
