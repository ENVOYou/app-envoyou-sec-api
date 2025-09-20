'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ElevatedCard, CardHeader, CardTitle, CardDescription, CardContent, Card } from '@/components/ui/elevated-card'
import { LoadingIcon, EyeIcon, EyeOffIcon, GoogleIcon, GitHubIcon, CheckIcon } from '@/components/icons/index'
import AuthSplitLayout from '@/components/ui/auth-split-layout'
import { AuthError, mapSupabaseError, createAuthError } from '@/lib/authErrors'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  // Redirect if already authenticated
  if (user) {
    router.push('/dashboard')
    return null
  }

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasNonalphas = /\W/.test(password)
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasNonalphas,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers
    }
  }

  const passwordValidation = validatePassword(password)

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError(createAuthError('PASSWORD_MISMATCH'))
      setLoading(false)
      return
    }

    if (!passwordValidation.isValid) {
      setError(createAuthError('PASSWORD_WEAK'))
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: unknown) {
      setError(mapSupabaseError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (err: unknown) {
      const details = err instanceof Error ? err.message : 'OAuth error'
      setError(createAuthError('OAUTH_ERROR', { details, cause: err }))
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We&apos;ve sent you a confirmation link at <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to activate your account and complete the registration process.
                </p>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
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
    <AuthSplitLayout
      title="Join Envoyou"
      subtitle="Create your account and start accessing unified environmental data."
      updates={[
        { title: 'Team Workspaces', description: 'Invite teammates to collaborate with role-based permissions.', date: 'Planned' },
        { title: 'Data Export Jobs', description: 'Schedule periodic bulk exports to S3 (alpha soon).', date: 'Coming Soon' },
        { title: 'Expanded Coverage', description: 'Adding more satellite-derived atmospheric metrics.' }
      ]}
    >
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground text-sm">Your gateway to real-time environmental insight</p>
        </div>
        <ElevatedCard>
          <CardHeader className="pb-4 relative">
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Create your account to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-7 relative">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="social"
                className="w-full h-11"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <GoogleIcon className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="social"
                className="w-full h-11"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
              >
                <GitHubIcon className="w-5 h-5 mr-2" />
                Continue with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
              <span className="px-4 py-1 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium shadow-sm">
                Or continue with email
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailRegister} className="space-y-5">
              {error && (
                <div className="p-4 text-sm bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {error.message}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 border-2 focus:border-primary transition-colors"
                />
              </div>

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

              <div className="space-y-3">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-12 h-11 border-2 focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {password && (
                  <div className="text-xs space-y-2 p-3 bg-muted/30 rounded-lg border">
                    <div className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <CheckIcon className={`w-3 h-3 ${passwordValidation.minLength ? 'opacity-100' : 'opacity-30'}`} />
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <CheckIcon className={`w-3 h-3 ${passwordValidation.hasUpperCase ? 'opacity-100' : 'opacity-30'}`} />
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <CheckIcon className={`w-3 h-3 ${passwordValidation.hasLowerCase ? 'opacity-100' : 'opacity-30'}`} />
                      <span>One lowercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasNumbers ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <CheckIcon className={`w-3 h-3 ${passwordValidation.hasNumbers ? 'opacity-100' : 'opacity-30'}`} />
                      <span>One number</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-12 h-11 border-2 focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-medium text-base shadow-md hover:shadow-xl transition-all duration-300 relative bg-[linear-gradient(to_bottom,oklch(var(--color-primary)/1)_0%,oklch(var(--color-primary)/0.85)_100%)] ring-1 ring-inset ring-white/10 dark:ring-black/40 after:absolute after:inset-0 after:rounded-md after:pointer-events-none after:[mask:linear-gradient(to_bottom,black,transparent)] after:bg-white/30 dark:after:bg-white/10 after:opacity-40"
                disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
              >
                {loading ? (
                  <>
                    <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/auth/login"
                  className="text-primary hover:text-primary/80 underline font-medium transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </ElevatedCard>
      </div>
    </AuthSplitLayout>
  )
}