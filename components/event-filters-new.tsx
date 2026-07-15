'use client'

import { useState } from 'react'
import { Calendar, Clock, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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
  startTime?: string
  endTime?: string
}

interface EventFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  isLoading: boolean
  onApply: () => void
  onReset: () => void
  hasAppliedFilters?: boolean
}

export function EventFilters({
  onFiltersChange,
  isLoading,
  onApply,
  onReset,
  hasAppliedFilters = false,
}: EventFiltersProps) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [startTime, setStartTime] = useState('00:00')
  const [endTime, setEndTime] = useState('23:59')

  const handleApply = () => {
    const startDateStr = startDate ? format(startDate, 'yyyy-MM-dd') : ''
    const endDateStr = endDate ? format(endDate, 'yyyy-MM-dd') : ''

    onFiltersChange({
      search: search.trim(),
      type,
      startDate: startDateStr,
      endDate: endDateStr,
      startTime,
      endTime,
    })
    onApply()
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
      startTime: '00:00',
      endTime: '23:59',
    })
    onReset()
  }

  return (
    <div className="space-y-4 rounded-[var(--radius)] border border-border bg-card p-4 sm:p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Search */}
        <div className="space-y-1.5">
          <Label htmlFor="search" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Device ID
          </Label>
          <Input
            id="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Event Type */}
        <div className="space-y-1.5">
          <Label htmlFor="type" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Event Type
          </Label>
          <Select value={type} onValueChange={setType as any} disabled={isLoading}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="1">Detection</SelectItem>
              <SelectItem value="2">Session</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Start Date
          </Label>
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-8"
                disabled={isLoading}
              >
                <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{startDate ? format(startDate, 'MMM dd, yyyy') : 'Pick a date'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) =>
                  endDate ? date > endDate : false
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            End Date
          </Label>
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-8"
                disabled={isLoading}
              >
                <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{endDate ? format(endDate, 'MMM dd, yyyy') : 'Pick a date'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) =>
                  startDate ? date < startDate : false
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Start Time */}
        <div className="space-y-1.5">
          <Label htmlFor="startTime" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Start Time
          </Label>
          <div className="relative flex items-center">
            <Clock className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={isLoading}
              className="w-full h-8 pl-8 pr-2.5 rounded-[var(--radius)] border border-border bg-background text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background/25"
            />
          </div>
        </div>

        {/* End Time */}
        <div className="space-y-1.5">
          <Label htmlFor="endTime" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            End Time
          </Label>
          <div className="relative flex items-center">
            <Clock className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={isLoading}
              className="w-full h-8 pl-8 pr-2.5 rounded-[var(--radius)] border border-border bg-background text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background/25"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1">
        <Button onClick={handleApply} disabled={isLoading} size="sm" className="gap-1.5">
          <span>Apply Filters</span>
        </Button>
        {hasAppliedFilters && (
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            size="sm"
            className="gap-1.5 text-xs"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  )
}
