'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EventFilters, type FilterState } from '@/components/event-filters-new'
import { EventsTable } from '@/components/events-table'
import { ScalablePagination } from '@/components/scalable-pagination'
import { AutoRefreshControl } from '@/components/auto-refresh-control'
import { ProtectedLayout } from '@/components/protected-layout'
import type { PaginatedResponse } from '@/lib/types'

function EventsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<PaginatedResponse>({
    events: [],
    total: 0,
    page: 1,
    pageSize: 25,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    startDate: '',
    endDate: '',
  })

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

  const handleApplyFilters = useCallback(() => {
    setHasAppliedFilters(true)
    fetchEvents(1, data.pageSize, filters)
  }, [fetchEvents, filters, data.pageSize])

  const handleResetFilters = useCallback(() => {
    setHasAppliedFilters(false)
    const resetFilters = {
      search: '',
      type: 'all',
      startDate: '',
      endDate: '',
    }
    setFilters(resetFilters)
    fetchEvents(1, data.pageSize, resetFilters)
  }, [fetchEvents, data.pageSize])

  // Initialize filters from URL
  useEffect(() => {
    const newFilters = {
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || 'all',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    }
    setFilters(newFilters)
    setHasAppliedFilters(Object.values(newFilters).some(v => v !== '' && v !== 'all'))
  }, [searchParams])

  // Load events on mount (default with no filters)
  useEffect(() => {
    fetchEvents(1, 25)
  }, [fetchEvents])

  // Fetch when page or pageSize changes
  const handlePageChange = (newPage: number) => {
    setData((prev) => ({ ...prev, page: newPage }))
    fetchEvents(newPage, data.pageSize)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setData((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }))
    fetchEvents(1, newPageSize)
  }

  return (
    <div className="flex flex-col gap-6 mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and analyze events from wearable devices
          </p>
        </div>
        <AutoRefreshControl onRefresh={() => fetchEvents(data.page, data.pageSize)} isLoading={isLoading} />
      </div>

      {/* Filters */}
      <EventFilters
        onFiltersChange={setFilters}
        isLoading={isLoading}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        hasAppliedFilters={hasAppliedFilters}
      />

      {/* Table */}
      <EventsTable data={data} isLoading={isLoading} />

      {/* Pagination */}
      <ScalablePagination
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />
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
