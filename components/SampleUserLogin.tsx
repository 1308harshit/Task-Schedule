"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface SampleUserLoginProps {
  email: string
  password: string
  label: string
  color: string
  icon: string
}

export default function SampleUserLogin({ email, password, label, color, icon }: SampleUserLoginProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/sample-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(data.redirectUrl)
        router.refresh()
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${color} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 transition-colors disabled:opacity-50`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      ) : (
        <span className="mr-2">{icon}</span>
      )}
      {loading ? 'Signing in...' : label}
    </button>
  )
}
