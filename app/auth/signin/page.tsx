import { Suspense } from "react"
import LoginForm from "@/components/LoginForm"
import SampleUserLogin from "@/components/SampleUserLogin"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600 text-lg">
            Unified Project Management & Tracking System
          </p>
        </div>
        <div className="mt-8">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Sign in to your account
              </h2>
              <p className="text-gray-600 mb-8">
                Choose your login method
              </p>
              
                      {/* Login Form */}
                      <div className="mb-6">
                        <Suspense fallback={<div>Loading...</div>}>
                          <LoginForm />
                        </Suspense>
                      </div>

                      {/* Divider */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                      </div>

              {/* Existing Users Login */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Login with Sample Users
                </h3>
                
                {/* Admin User */}
                <SampleUserLogin
                  email="admin@taskmanager.com"
                  password="admin123"
                  label="Login as Admin"
                  color="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  icon="👑"
                />

                {/* Developer 1 */}
                <SampleUserLogin
                  email="developer1@taskmanager.com"
                  password="dev123"
                  label="Login as John Developer"
                  color="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  icon="👨‍💻"
                />

                {/* Developer 2 */}
                <SampleUserLogin
                  email="developer2@taskmanager.com"
                  password="dev123"
                  label="Login as Jane Developer"
                  color="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  icon="👩‍💻"
                />
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Sample users for testing the application
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
