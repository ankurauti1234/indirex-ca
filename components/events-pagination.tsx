'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface EventsPaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  isLoading: boolean
}

export function EventsPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: EventsPaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <label htmlFor="pageSize" className="text-sm font-medium">
          Rows per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(parseInt(e.target.value))
            onPageChange(1)
          }}
          disabled={isLoading}
          className="px-3 py-2 rounded-md border border-input bg-background text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of{' '}
        {total.toLocaleString()} events
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={isLoading || page === 1}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            let pageNum: number

            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (page <= 3) {
              pageNum = i + 1
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = page - 2 + i
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  page === pageNum
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-input bg-background hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={isLoading || page === totalPages}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
