"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, Check, X } from "lucide-react"

const ResetPassword = ()=> {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState("")

  useEffect(() => {
    // Get reset token from localStorage
    const resetToken = localStorage.getItem("resetToken")
    if (resetToken) {
      setToken(resetToken)
    } else {
      // Redirect to forgot password if no token found
      window.location.href = "/auth/forgot-password"
    }
  }, [])

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "", color: "" }

    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    strength = Object.values(checks).filter(Boolean).length

    const strengthData = {
      0: { text: "", color: "" },
      1: { text: "Very Weak", color: "text-red-500" },
      2: { text: "Weak", color: "text-red-400" },
      3: { text: "Fair", color: "text-yellow-500" },
      4: { text: "Good", color: "text-blue-500" },
      5: { text: "Strong", color: "text-green-500" },
    }

    return {
      strength,
      text: strengthData[strength as keyof typeof strengthData].text,
      color: strengthData[strength as keyof typeof strengthData].color,
      checks,
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword
  const passwordsDontMatch = newPassword && confirmPassword && newPassword !== confirmPassword

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (passwordStrength.strength < 3) {
      setError("Password is too weak. Please choose a stronger password.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // API call to reset password
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Clear stored data
        localStorage.removeItem("resetToken")
        localStorage.removeItem("resetEmail")
        // Redirect to login after success
        setTimeout(() => {
          window.location.href = "/auth/login"
        }, 3000)
      } else {
        setError(data.message || "Failed to reset password")
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.error("Reset password error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    localStorage.removeItem("resetToken")
    localStorage.removeItem("resetEmail")
    window.location.href = "/auth/login"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleResetPassword()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mx-auto">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">Create a new password for your account</CardDescription>
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
                <p className="text-sm text-green-700 font-medium">Password Reset Successful!</p>
              </div>
              <p className="text-sm text-green-700">Your password has been updated successfully.</p>
              <p className="text-xs text-green-600 mt-1">Redirecting to login page...</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-gray-700 font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter new password"
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 pr-10"
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading || success}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Password Strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.text}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div
                      className={`flex items-center space-x-1 ${passwordStrength.checks.length ? "text-green-600" : "text-gray-400"}`}
                    >
                      {passwordStrength.checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      <span>8+ characters</span>
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${passwordStrength.checks.uppercase ? "text-green-600" : "text-gray-400"}`}
                    >
                      {passwordStrength.checks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      <span>Uppercase</span>
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${passwordStrength.checks.lowercase ? "text-green-600" : "text-gray-400"}`}
                    >
                      {passwordStrength.checks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      <span>Lowercase</span>
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${passwordStrength.checks.number ? "text-green-600" : "text-gray-400"}`}
                    >
                      {passwordStrength.checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      <span>Number</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm new password"
                  className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 pr-10 ${
                    passwordsDontMatch ? "border-red-300 focus:border-red-400 focus:ring-red-400" : ""
                  } ${passwordsMatch ? "border-green-300 focus:border-green-400 focus:ring-green-400" : ""}`}
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading || success}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {passwordsMatch && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Passwords match
                </p>
              </div>
            )}

            {passwordsDontMatch && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 flex items-center">
                  <X className="h-4 w-4 mr-2" />
                  Passwords do not match
                </p>
              </div>
            )}

            <Button
              onClick={handleResetPassword}
              disabled={
                isLoading ||
                !newPassword ||
                !confirmPassword ||
                passwordsDontMatch ||
                passwordStrength.strength < 3 ||
                success
              }
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? "Resetting..." : success ? "Password Reset!" : "Reset Password"}
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
  )
}

export default ResetPassword
