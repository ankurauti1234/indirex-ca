'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { EventFilters, type FilterState } from '@/components/event-filters-new'
import { EventsTable } from '@/components/events-table'
import { ScalablePagination } from '@/components/scalable-pagination'
import { ProtectedLayout } from '@/components/protected-layout'
import type { PaginatedResponse } from '@/lib/types'

function EventsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<PaginatedResponse>({
    events: [],
    total: 0,
    page: 1,
    pageSize: 25,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    startDate: '',
    endDate: '',
  })
  const [eventTypes, setEventTypes] = useState<{ id: number; name: string }[]>([])

  // Fetch event types lookup
  useEffect(() => {
    async function fetchEventTypes() {
      try {
        const response = await fetch('/api/event-types')
        if (response.ok) {
          const data = await response.json()
          setEventTypes(data)
        }
      } catch (err) {
        console.error('Failed to fetch event types:', err)
      }
    }
    fetchEventTypes()
  }, [])

  const fetchEvents = useCallback(
    async (page: number, pageSize: number, currentFilters?: FilterState) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('pageSize', pageSize.toString())

        const filtersToUse = currentFilters || filters

        if (filtersToUse.search) {
          params.set('search', filtersToUse.search)
        }
        if (filtersToUse.type !== 'all') {
          params.set('type', filtersToUse.type)
        }
        if (filtersToUse.startDate) {
          params.set('startDate', filtersToUse.startDate)
        }
        if (filtersToUse.endDate) {
          params.set('endDate', filtersToUse.endDate)
        }

        const response = await fetch(`/api/events?${params}`)
        if (!response.ok) throw new Error('Failed to fetch events')

        const result: PaginatedResponse = await response.json()
        setData(result)
      } catch (error) {
        console.error('[v0] Fetch error:', error)
        setData({ events: [], total: 0, page, pageSize })
      } finally {
        setIsLoading(false)
      }
    },
    [filters]
  )

  const handleApplyFilters = useCallback((appliedFilters: FilterState) => {
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('pageSize', data.pageSize.toString())
    if (appliedFilters.search) params.set('search', appliedFilters.search)
    if (appliedFilters.type !== 'all') params.set('type', appliedFilters.type)
    if (appliedFilters.startDate) params.set('startDate', appliedFilters.startDate)
    if (appliedFilters.endDate) params.set('endDate', appliedFilters.endDate)
    
    router.push(`/events?${params.toString()}`)
    setFilters(appliedFilters)
    fetchEvents(1, data.pageSize, appliedFilters)
  }, [fetchEvents, data.pageSize, router])

  const handleResetFilters = useCallback(() => {
    const resetFilters = {
      search: '',
      type: 'all',
      startDate: '',
      endDate: '',
    }
    setFilters(resetFilters)
    router.push('/events')
    fetchEvents(1, data.pageSize, resetFilters)
  }, [fetchEvents, data.pageSize, router])

  // Load events on mount (including initial filters from URL)
  useEffect(() => {
    const initialFilters = {
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || 'all',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    }
    setFilters(initialFilters)
    fetchEvents(1, 25, initialFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Fetch when page or pageSize changes
  const handlePageChange = (newPage: number) => {
    setData((prev) => ({ ...prev, page: newPage }))
    
    const params = new URLSearchParams()
    params.set('page', newPage.toString())
    params.set('pageSize', data.pageSize.toString())
    if (filters.search) params.set('search', filters.search)
    if (filters.type !== 'all') params.set('type', filters.type)
    if (filters.startDate) params.set('startDate', filters.startDate)
    if (filters.endDate) params.set('endDate', filters.endDate)
    router.push(`/events?${params.toString()}`)

    fetchEvents(newPage, data.pageSize)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setData((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }))
    
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('pageSize', newPageSize.toString())
    if (filters.search) params.set('search', filters.search)
    if (filters.type !== 'all') params.set('type', filters.type)
    if (filters.startDate) params.set('startDate', filters.startDate)
    if (filters.endDate) params.set('endDate', filters.endDate)
    router.push(`/events?${params.toString()}`)

    fetchEvents(1, newPageSize)
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="py-6 px-6 border-b border-border/50 bg-background">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Events</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Monitor and analyze events from wearable devices
            </p>
          </div>
        </div>
      </div>

      <EventFilters
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        onRefresh={() => fetchEvents(data.page, data.pageSize)}
        eventTypes={eventTypes}
      />

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <EventsTable data={data} isLoading={isLoading} />
      </div>

      {/* Pagination */}
      <div className="px-6 py-2 border-t border-border/50 bg-background">
        <ScalablePagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default function EventsPage() {
  return (
    <ProtectedLayout>
      <EventsPageContent />
    </ProtectedLayout>
  )
}
