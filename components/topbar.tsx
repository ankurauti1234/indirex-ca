'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { LogOut, ChevronDown, Search, HelpCircle, Bell, Settings } from 'lucide-react'

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
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-30 h-14 animate-in fade-in select-none">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Left side - Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-foreground select-none">
            {/* Org */}
            <div className="flex items-center gap-1.5 hover:text-foreground cursor-pointer text-muted-foreground/80 transition-colors">
              <svg className="h-3.5 w-3.5 text-primary fill-primary" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <span>inditronics</span>
            </div>
            
            <span className="text-muted-foreground/30 font-normal">/</span>
            
            {/* Project */}
            <div className="flex items-center gap-1 hover:text-foreground cursor-pointer text-muted-foreground/80 transition-colors">
              <span>indirex</span>
            </div>

            <span className="text-muted-foreground/30 font-normal">/</span>

            {/* Branch */}
            <div className="flex items-center gap-1.5 hover:text-foreground cursor-pointer text-muted-foreground/80 transition-colors">
              <span>canada</span>
            </div>
          </div>
        </div>

        {/* Right side - Feedback, Search & Icons */}
        <div className="flex items-center gap-4">
          <button className="text-[11px] text-muted-foreground/70 hover:text-foreground font-medium transition-colors px-2 py-1 cursor-pointer">
            Feedback
          </button>

          {/* Search Pill */}
          <div className="relative hidden lg:flex items-center h-7 px-2.5 rounded-md bg-muted/50 border border-border text-xs text-muted-foreground/60 w-44 hover:border-border/80 cursor-pointer select-none">
            <Search className="h-3 w-3 mr-1.5 stroke-[2]" />
            <span>Search...</span>
            <kbd className="absolute right-1.5 top-1 bottom-1 px-1 bg-muted text-[8px] rounded flex items-center border border-border font-mono">Ctrl K</kbd>
          </div>

          {/* Icon group */}
          <div className="flex items-center gap-1.5 text-muted-foreground/70">
            <button className="p-1.5 rounded-md hover:bg-muted/40 hover:text-foreground transition-colors cursor-pointer">
              <HelpCircle className="h-4 w-4 stroke-[1.8]" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted/40 hover:text-foreground transition-colors cursor-pointer">
              <Bell className="h-4 w-4 stroke-[1.8]" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted/40 hover:text-foreground transition-colors cursor-pointer">
              <Settings className="h-4 w-4 stroke-[1.8]" />
            </button>
          </div>

          {/* Dropdown Menu Container */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-muted/40 border border-transparent hover:border-border/30 transition-all duration-150 cursor-pointer"
            >
              {/* Avatar */}
              <div className="h-6.5 w-6.5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shadow-sm">
                {initials}
              </div>
              <ChevronDown 
                className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-md border border-border bg-card shadow-md py-1 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                {/* User info */}
                <div className="px-3 py-2 border-b border-border/60">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Signed in as
                  </p>
                  <p className="text-xs font-medium text-foreground truncate mt-0.5">
                    {userEmail}
                  </p>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted/80 transition-colors text-left font-medium cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
