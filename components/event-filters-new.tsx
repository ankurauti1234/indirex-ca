'use client'

import { useState, useEffect } from 'react'
import { Calendar, X, Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { AutoRefreshControl } from '@/components/auto-refresh-control'
import { useTimezone } from '@/lib/timezone-context'

export interface FilterState {
  search: string
  type: string
  startDate: string
  endDate: string
}

interface EventFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isLoading: boolean
  onApply: (appliedFilters: FilterState) => void
  onReset: () => void
  onRefresh: () => void
  eventTypes?: { id: number; name: string }[]
}

function getTimezoneOffset(timezone: string, date: Date): string {
  if (timezone === 'UTC') return 'Z'

  if (timezone === 'locale') {
    const offsetMin = -date.getTimezoneOffset()
    const sign = offsetMin >= 0 ? '+' : '-'
    const hours = Math.floor(Math.abs(offsetMin) / 60).toString().padStart(2, '0')
    const mins = (Math.abs(offsetMin) % 60).toString().padStart(2, '0')
    return `${sign}${hours}:${mins}`
  }

  let timeZoneId = 'Asia/Kolkata'
  if (timezone === 'Canada') {
    timeZoneId = 'America/Toronto'
  }

  try {
    const tzString = date.toLocaleString('en-US', { timeZone: timeZoneId, timeZoneName: 'longOffset' })
    const match = tzString.match(/GMT([+-]\d+):?(\d+)?/)
    if (match) {
      const sign = match[1][0]
      const hours = match[1].substring(1).padStart(2, '0')
      const mins = (match[2] || '00').padStart(2, '0')
      return `${sign}${hours}:${mins}`
    }
    return 'Z'
  } catch (e) {
    return 'Z'
  }
}

export function EventFilters({
  filters,
  onFiltersChange,
  isLoading,
  onApply,
  onReset,
  onRefresh,
  eventTypes,
}: EventFiltersProps) {
  const { timezone } = useTimezone()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [startTime, setStartTime] = useState('00:00')
  const [endTime, setEndTime] = useState('23:59')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Sync local UI inputs when parent filters change (e.g. initial URL parse, reset, etc.)
  useEffect(() => {
    setSearch(filters.search || '')
    setType(filters.type || 'all')

    if (filters.startDate) {
      const parts = filters.startDate.split('T')
      setStartDate(new Date(parts[0]))
      if (parts[1]) setStartTime(parts[1].substring(0, 5))
    } else {
      setStartDate(undefined)
      setStartTime('00:00')
    }

    if (filters.endDate) {
      const parts = filters.endDate.split('T')
      setEndDate(new Date(parts[0]))
      if (parts[1]) setEndTime(parts[1].substring(0, 5))
    } else {
      setEndDate(undefined)
      setEndTime('23:59')
    }
  }, [filters])

  const handleApply = () => {
    let startDateStr = ''
    if (startDate) {
      const offset = getTimezoneOffset(timezone, startDate)
      startDateStr = `${format(startDate, 'yyyy-MM-dd')}T${startTime}:00${offset}`
    }

    let endDateStr = ''
    if (endDate) {
      const offset = getTimezoneOffset(timezone, endDate)
      endDateStr = `${format(endDate, 'yyyy-MM-dd')}T${endTime}:59${offset}`
    }

    const newFilters = {
      search: search.trim(),
      type,
      startDate: startDateStr,
      endDate: endDateStr,
    }

    onFiltersChange(newFilters)
    onApply(newFilters)
  }

  const handleReset = () => {
    setSearch('')
    setType('all')
    setStartDate(undefined)
    setEndDate(undefined)
    setStartTime('00:00')
    setEndTime('23:59')
    onFiltersChange({
      search: '',
      type: 'all',
      startDate: '',
      endDate: '',
    })
    onReset()
  }

  // Display the reset button ONLY if filters have been applied to the dashboard
  const isFilterApplied =
    filters.search !== '' ||
    filters.type !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== ''

  return (
    <div className="flex flex-col gap-3 py-3 px-6 bg-card border-b border-border/50 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Left side filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input Bar (No leading select dropdown) */}
          <div className="relative flex items-center rounded-md bg-background border border-border h-8 w-48 lg:w-64">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by device ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
              className="bg-transparent border-0 outline-none text-xs text-foreground placeholder:text-muted-foreground/45 pl-8 pr-8 h-full w-full focus:ring-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApply()
              }}
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('')
                }}
                className="absolute right-2 px-1 text-muted-foreground/50 hover:text-foreground h-full flex items-center cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Event Type Select */}
          <Select value={type} onValueChange={(val) => setType(val || 'all')} disabled={isLoading}>
            <SelectTrigger className="h-8 bg-background border border-border text-xs w-[120px] text-muted-foreground hover:text-foreground flex items-center justify-between">
              <span>
                {type === 'all' && 'All Events'}
                {type !== 'all' && eventTypes && eventTypes.length > 0 && (() => {
                  const matched = eventTypes.find(t => t.id.toString() === type)
                  return matched ? matched.name.charAt(0).toUpperCase() + matched.name.slice(1) : `Type ${type}`
                })()}
                {type !== 'all' && (!eventTypes || eventTypes.length === 0) && (
                  type === '1' ? 'Detection' : type === '2' ? 'Session' : `Type ${type}`
                )}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {eventTypes && eventTypes.length > 0 ? (
                eventTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="1">Detection</SelectItem>
                  <SelectItem value="2">Session</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          {/* Date Picker Popover (No nested apply button, contains start & end time selectors) */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger className="flex items-center gap-1.5 h-8 px-2.5 bg-background border border-border rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <Calendar className="h-3.5 w-3.5 stroke-[1.8]" />
              <span>
                {startDate ? (
                  endDate
                    ? `${format(startDate, 'MMM d')} ${startTime} - ${format(endDate, 'MMM d')} ${endTime}`
                    : `${format(startDate, 'MMM d')} ${startTime}`
                ) : (
                  'Filter by date'
                )}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 flex flex-col gap-3 bg-card border border-border rounded-md shadow-md" align="start">
              <div className="flex items-start gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Start Date</Label>
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => (endDate ? date > endDate : false)}
                    className="border border-border rounded-md scale-90 origin-top-left"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground px-1">End Date</Label>
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => (startDate ? date < startDate : false)}
                    className="border border-border rounded-md scale-90 origin-top-left"
                  />
                </div>
              </div>

              {/* Time Selectors inside same date popover */}
              <div className="flex gap-4 border-t border-border/50 pt-3 mt-1">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Start Time</Label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value || '00:00')}
                    disabled={isLoading}
                    className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus-visible:ring-1 focus-visible:ring-primary/20 outline-none"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground px-1">End Time</Label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value || '23:59')}
                    disabled={isLoading}
                    className="w-full h-8 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus-visible:ring-1 focus-visible:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              {/* Popover Action Buttons */}
              <div className="flex justify-between items-center gap-2 border-t border-border/50 pt-2.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setStartDate(undefined)
                    setEndDate(undefined)
                    setStartTime('00:00')
                    setEndTime('23:59')
                  }}
                  className="h-8 text-xs cursor-pointer"
                >
                  Clear Date & Time
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    setIsCalendarOpen(false)
                  }}
                  className="h-8 text-xs px-4 font-medium cursor-pointer"
                >
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right side controls - Apply & Refresh Buttons next to each other */}
        <div className="flex items-center gap-2">
          {/* Auto Refresh dropdown selector inside filters */}
          <AutoRefreshControl onRefresh={onRefresh} isLoading={isLoading} compact={true} />

          {/* Refresh Action Trigger next to Apply button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center justify-center h-8 w-8 rounded-md bg-background border border-border hover:border-border/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Refresh events"
          >
            <svg
              className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>

          {/* Apply button & conditional reset X button */}
          <div className="inline-flex items-center rounded-md bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm text-xs font-semibold h-8 overflow-hidden select-none">
            <button
              onClick={handleApply}
              className={`px-3 py-1.5 h-full flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider text-[10px] ${
                isFilterApplied ? 'border-r border-primary-foreground/15' : ''
              }`}
            >
              <span>Apply Filters</span>
            </button>
            {isFilterApplied && (
              <button
                onClick={handleReset}
                className="px-2 h-full flex items-center hover:bg-primary-foreground/5 cursor-pointer"
                title="Reset Filters"
              >
                <X className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
