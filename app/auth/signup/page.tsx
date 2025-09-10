import { Suspense } from "react"
import SignupForm from "@/components/SignupForm"

export default function SignupPage() {
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
                Create your account
              </h2>
              <p className="text-gray-600 mb-8">
                Join our task management system
              </p>
              
              {/* Signup Form */}
              <div className="mb-6">
                <Suspense fallback={<div>Loading...</div>}>
                  <SignupForm />
                </Suspense>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
