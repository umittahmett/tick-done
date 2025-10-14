"use client"

import type React from "react"

import { useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Zap, ArrowLeft } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'enter-email' | 'otp-sent' | 'otp-verified'>('enter-email')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  async function onGetOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await api.forgotPassword(email)
      setStatus("otp-sent")
      toast({
        title: "OTP sent!",
        description: "Check your inbox for password reset instructions.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onVerifyOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      console.log(email, otp)
      await api.verifyOtp(email, otp)
      setStatus("otp-verified")
      toast({
        title: "OTP verified!",
        description: "Check your inbox for password reset instructions.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to verify OTP",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onResetPasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    if (confirmPassword !== password) {
      toast({
        title: "Passwords do not match",
        description: "Please enter the same password in both fields",
        variant: "destructive",
      })
      return
    }

    try {
      await api.resetPassword(email, password)
      setStatus("otp-verified")
      toast({
        title: "Password reset!",
        description: "Your password has been reset.",
      })
      router.push("/auth/login")
    } catch (error: any) {
      router.push("/auth/forgot-password")
      toast({
        title: "Failed to reset password",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Zap className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-2xl font-semibold">TaskFlow</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{
            status === "otp-sent"
            ? "One Time Password"
            : status === "otp-verified"
            ? "Verify One Time Password"
            : "Enter your email"
            }
            </CardTitle>
            <CardDescription>
              {
                status === "otp-sent"
                ? "We've sent a one time password to your email"
                : status === "otp-verified"
                ? "Enter the one time password sent to your email"
                : "Enter your email"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "enter-email" && 
              <form onSubmit={onGetOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            }

            {status === "otp-sent" && 
              <form onSubmit={onVerifyOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">One Time Password</Label>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={otp}
                    onChange={(e) => setOtp(e)}
                    required
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            }

            {status === "otp-verified" && 
              <form onSubmit={onResetPasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Enter your password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Reset Password"}
                </Button>
              </form>
            }

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
