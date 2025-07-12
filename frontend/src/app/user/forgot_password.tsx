"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import OuterNavbar from "@/components/outer_navbar"

const ForgotPassword = ()=> {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // API call to send OTP
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage(data.message || "OTP has been sent to your email address")
        // Store email in localStorage for OTP verification page
        localStorage.setItem("resetEmail", email)
        // Redirect to OTP verification after 2 seconds
        setTimeout(() => {
          window.location.href = "/auth/verify-otp"
        }, 2000)
      } else {
        setError(data.message || "Failed to send OTP")
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("Forgot password error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    window.location.href = "/login"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendOTP()
    }
  }

  return (
    <div><OuterNavbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mx-auto">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Enter your email to receive a verification code
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm text-green-700 font-medium">Success!</p>
              </div>
              <p className="text-sm text-green-700">{message}</p>
              <p className="text-xs text-green-600 mt-1">Redirecting to OTP verification...</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email address"
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                disabled={isLoading || success}
              />
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={isLoading || !email || success}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? "Sending..." : success ? "OTP Sent!" : "Send OTP"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleBackToLogin}
              disabled={isLoading}
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}

export default ForgotPassword
