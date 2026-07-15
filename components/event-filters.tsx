'use client'

import { useDebounce, useQueryParams } from '@/lib/hooks'
import { useState, useEffect } from 'react'

interface EventFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  isLoading: boolean
}

export interface FilterState {
  search: string
  type: string
  startDate: string
  endDate: string
}

export function EventFilters({ onFiltersChange, isLoading }: EventFiltersProps) {
  const { getParams, setParam } = useQueryParams()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const debouncedSearch = useDebounce(search, 300)

  // Initialize from URL params
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = getParams()
    setSearch(params.get('search') || '')
    setType(params.get('type') || 'all')
    setStartDate(params.get('startDate') || '')
    setEndDate(params.get('endDate') || '')
  }, [])

  // Update parent and URL when filters change
  useEffect(() => {
    const filters = {
      search: debouncedSearch,
      type,
      startDate,
      endDate,
    }

    onFiltersChange(filters)

    // Update URL params
    if (debouncedSearch) {
      setParam('search', debouncedSearch)
    } else {
      setParam('search', null)
    }

    if (type !== 'all') {
      setParam('type', type)
    } else {
      setParam('type', null)
    }

    if (startDate) {
      setParam('startDate', startDate)
    } else {
      setParam('startDate', null)
    }

    if (endDate) {
      setParam('endDate', endDate)
    } else {
      setParam('endDate', null)
    }
  }, [debouncedSearch, type, startDate, endDate, setParam])

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
            Search Device ID
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
            Event Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all text-sm"
          >
            <option value="all">All Events</option>
            <option value="1">Detection</option>
            <option value="2">Session</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
            Start Date
          </label>
          <input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
            End Date
          </label>
          <input
            id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all text-sm"
          />
        </div>
      </div>
    </div>
  )
}
