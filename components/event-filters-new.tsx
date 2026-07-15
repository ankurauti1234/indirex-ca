'use client'

import { useState } from 'react'
import { Calendar, X, Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'

export interface FilterState {
  search: string
  type: string
  startDate: string
  endDate: string
}

interface EventFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  isLoading: boolean
  onApply: () => void
  onReset: () => void
}

export function EventFilters({
  onFiltersChange,
  isLoading,
  onApply,
  onReset,
}: EventFiltersProps) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const handleApply = () => {
    const startDateStr = startDate ? format(startDate, 'yyyy-MM-dd') : ''
    const endDateStr = endDate ? format(endDate, 'yyyy-MM-dd') : ''

    onFiltersChange({
      search: search.trim(),
      type,
      startDate: startDateStr,
      endDate: endDateStr,
    })
    onApply()
  }

  const handleReset = () => {
    setSearch('')
    setType('all')
    setStartDate(undefined)
    setEndDate(undefined)
    onFiltersChange({
      search: '',
      type: 'all',
      startDate: '',
      endDate: '',
    })
    onReset()
  }

  return (
    <div className="flex flex-col gap-3 py-3 px-6 bg-card border-b border-border/50 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Left side filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Column filter dropdown */}
          <div className="flex items-center rounded-md bg-background border border-border h-8 overflow-hidden">
            <Select value="device_id" disabled={isLoading}>
              <SelectTrigger className="border-0 bg-transparent h-full px-2.5 text-xs text-muted-foreground/80 hover:text-foreground focus:ring-0 focus:ring-offset-0 rounded-none border-r border-border gap-1 shadow-none">
                <Search className="h-3.5 w-3.5 text-muted-foreground/60" />
                <span>Device ID</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="device_id">Device ID</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by device ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
              className="bg-transparent border-0 outline-none text-xs text-foreground placeholder:text-muted-foreground/45 px-3 h-full w-48 lg:w-64 focus:ring-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApply()
              }}
            />
            
            {search && (
              <button 
                onClick={() => { setSearch(''); handleReset(); }}
                className="px-2 text-muted-foreground/50 hover:text-foreground h-full flex items-center cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Event Type Select */}
          <Select value={type} onValueChange={(val) => { setType(val || 'all'); }} disabled={isLoading}>
            <SelectTrigger className="h-8 bg-background border border-border text-xs w-[120px] text-muted-foreground hover:text-foreground">
              <SelectValue placeholder="All columns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="1">Detection</SelectItem>
              <SelectItem value="2">Session</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select value="newest" disabled={isLoading}>
            <SelectTrigger className="h-8 bg-background border border-border text-xs w-[150px] text-muted-foreground hover:text-foreground">
              <span>Sorted by timestamp</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Sorted by timestamp</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Picker Popover */}
          <Popover>
            <PopoverTrigger className="flex items-center gap-1.5 h-8 px-2.5 bg-background border border-border rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <Calendar className="h-3.5 w-3.5 stroke-[1.8]" />
              <span>
                {startDate ? (
                  endDate ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}` : format(startDate, 'MMM d')
                ) : 'Filter by date'}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 flex flex-col gap-3 bg-card border border-border rounded-md shadow-md" align="start">
              <div className="flex items-start gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Start</Label>
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => (endDate ? date > endDate : false)}
                    className="border border-border rounded-md scale-90 origin-top-left"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground px-1">End</Label>
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => (startDate ? date < startDate : false)}
                    className="border border-border rounded-md scale-90 origin-top-left"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border/50 pt-2.5">
                <Button size="sm" variant="outline" onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
                  Clear
                </Button>
                <Button size="sm" onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Refresh Action Trigger */}
          <button 
            onClick={handleApply}
            disabled={isLoading}
            className="flex items-center justify-center h-8 w-8 rounded-md bg-background border border-border hover:border-border/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <svg className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        {/* Right side trigger matching 'Add user' */}
        <div className="flex items-center">
          <div className="inline-flex items-center rounded-md bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm text-xs font-semibold h-8 overflow-hidden select-none">
            <button 
              onClick={handleApply}
              className="px-3 py-1.5 h-full flex items-center gap-1.5 border-r border-primary-foreground/15 cursor-pointer font-bold uppercase tracking-wider text-[10px]"
            >
              <span>Apply Filters</span>
            </button>
            <button 
              onClick={handleReset}
              className="px-2 h-full flex items-center hover:bg-primary-foreground/5 cursor-pointer"
              title="Reset Filters"
            >
              <X className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
