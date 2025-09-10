import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
// import { UserRole } from "@prisma/client"
import AdminDashboard from "@/components/admin/AdminDashboard"

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if ((session.user as any).role !== "ADMIN") {
    redirect("/developer/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage projects, modules, and team assignments</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {session.user.name || session.user.email}!
              </span>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Admin
              </div>
              <a
                href="/api/auth/signout"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <AdminDashboard />
        </Suspense>
      </main>
    </div>
  )
}
