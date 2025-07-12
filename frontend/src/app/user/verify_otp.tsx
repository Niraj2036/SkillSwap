"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"

const OTPVerification =() =>{
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("resetEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // Redirect to forgot password if no email found
      window.location.href = "/auth/forgot-password"
    }
  }, [])

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOTPChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6)
    setOtp(numericValue)
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // API call to verify OTP
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Store verification token for password reset
        localStorage.setItem("resetToken", data.token)
        // Redirect to reset password page
        setTimeout(() => {
          window.location.href = "/auth/reset-password"
        }, 1500)
      } else {
        setError(data.message || "Invalid OTP. Please try again.")
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("OTP verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)
    setError("")

    try {
      // API call to resend OTP
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setOtp("")
        setCountdown(60) // 60 seconds countdown
        setError("")
      } else {
        setError(data.message || "Failed to resend OTP")
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("Resend OTP error:", error)
    } finally {
      setResendLoading(false)
    }
  }

  const handleBackToForgot = () => {
    localStorage.removeItem("resetEmail")
    window.location.href = "/auth/forgot-password"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerifyOTP()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mx-auto">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Verify OTP
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">Enter the 6-digit code sent to {email}</CardDescription>
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
                <p className="text-sm text-green-700 font-medium">OTP Verified!</p>
              </div>
              <p className="text-xs text-green-600">Redirecting to password reset...</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-700 font-medium">
                Enter OTP
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => handleOTPChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 text-center text-lg tracking-widest font-mono"
                disabled={isLoading || success}
              />
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length !== 6 || success}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? "Verifying..." : success ? "Verified!" : "Verify OTP"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">{"Didn't receive the code?"}</p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resendLoading || countdown > 0 || success}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
              >
                {resendLoading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={handleBackToForgot}
              disabled={isLoading || success}
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OTPVerification
