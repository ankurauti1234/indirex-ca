'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user && !authLoading) {
      router.push('/events')
    }
  }, [user, authLoading, router, mounted])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      router.push('/events')
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-120px,rgba(var(--primary-rgb),0.06),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative w-full max-w-[400px] space-y-6">
        {/* Logo and Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)]">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Sign in to Indirex
            </h1>
            <p className="text-xs text-muted-foreground/80 max-w-[285px] mx-auto leading-normal">
              Monitor and audit device connection and traffic events in real-time.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[var(--radius)] border border-border/80 bg-card p-6 shadow-md md:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-[var(--radius)] bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>

        {/* Footer text */}
        <p className="text-center text-[10px] text-muted-foreground/60 leading-normal max-w-[280px] mx-auto uppercase tracking-wider">
          Demo credentials required. Contact your administrator.
        </p>
      </div>
    </div>
  )
}
