'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/elevated-card'
import { ElevatedCard } from '@/components/ui/elevated-card'
import { LoadingIcon, EyeIcon, EyeOffIcon, GoogleIcon, GitHubIcon } from '@/components/icons/index'
import AuthSplitLayout from '@/components/ui/auth-split-layout'
import { AuthError, mapSupabaseError, createAuthError } from '@/lib/authErrors'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  // Redirect if already authenticated
  if (user) {
    router.push('/dashboard')
    return null
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
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

  return (
    <AuthSplitLayout
      title="Welcome Back"
      subtitle="Access your unified environmental data dashboard"
      updates={[
        { title: 'Realtime Stream API', description: 'Streaming endpoint beta launching soon for live sensor data.', date: 'Coming Soon' },
        { title: 'Usage Analytics', description: 'Per-endpoint latency & quota dashboards added last release.', date: 'Latest' },
        { title: 'Global Data Layer', description: 'Expanded coverage for air & water quality indices.' },
        { title: 'Team Workspaces', description: 'Collaborate with granular roles & environment isolation.', date: 'Planned' },
        { title: 'Data Export Jobs', description: 'Automated batch exports to S3 & Glacier tiers.' }
      ]}
      forceCarousel
    >
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
          <p className="text-muted-foreground text-sm">Use social login or your credentials</p>
        </div>
        <ElevatedCard>
          <CardHeader className="pb-4 relative">
            <CardTitle className="text-xl">Your Account</CardTitle>
            <CardDescription>Secure access with OAuth or email</CardDescription>
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
              <span className="px-4 py-1 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium backdrop-blur-sm shadow-sm">
                Or continue with email
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
              {error && (
                <div className="p-4 text-sm bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {error.message}
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

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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
              </div>

              <Button
                type="submit"
                variant="elevated"
                className="w-full h-12 font-medium text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingIcon className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <Link 
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 underline font-medium transition-colors"
              >
                Forgot your password?
              </Link>
              
              <div className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/auth/register"
                  className="text-primary hover:text-primary/80 underline font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </ElevatedCard>
      </div>
    </AuthSplitLayout>
  )
}