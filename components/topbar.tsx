'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { LogOut, ChevronDown } from 'lucide-react'

export function Topbar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const userEmail = user?.email || 'User'
  const initials = userEmail
    .split('@')[0]
    .split('.')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Left side - App name */}
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-[var(--radius)] border border-primary/35 bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shadow-xs">
            I
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Indirex
          </h1>
          <span className="text-xs text-muted-foreground border-l border-border/60 pl-2.5 ml-0.5">Canada Wearable Devices</span>
        </div>

        {/* Right side - User menu */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-[var(--radius)] hover:bg-muted/60 border border-transparent hover:border-border/50 transition-all duration-150"
          >
            {/* Avatar */}
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shadow-xs">
              {initials}
            </div>
            
            {/* Email and chevron */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs font-medium text-foreground truncate max-w-[150px]">
                {userEmail}
              </span>
              <ChevronDown 
                className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-[var(--radius)] border border-border bg-card shadow-md py-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {/* User info */}
              <div className="px-3 py-2 border-b border-border/60">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Signed in as
                </p>
                <p className="text-xs font-medium text-foreground truncate mt-0.5">
                  {userEmail}
                </p>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted/80 transition-colors text-left font-medium"
              >
                <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
