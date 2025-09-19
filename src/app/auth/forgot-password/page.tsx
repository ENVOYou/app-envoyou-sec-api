'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingIcon, CheckIcon, ArrowLeftIcon } from '@/components/icons/index'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[size:20px_20px]" />
        
        <div className="w-full max-w-md space-y-6 relative z-10">
          <Card className="border-2 shadow-2xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">Check Your Email</CardTitle>
              <CardDescription>
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full h-11 border-2 hover:bg-accent/50 transition-all duration-200">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[size:20px_20px]" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Forgot Password</h1>
          <p className="text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <Card className="border-2 shadow-2xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              Enter the email address associated with your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleResetPassword} className="space-y-5">
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 border-2 focus:border-primary transition-colors"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href="/auth/login"
                className="text-sm text-primary hover:text-primary/80 underline font-medium inline-flex items-center transition-colors"
              >
                <ArrowLeftIcon className="w-3 h-3 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}