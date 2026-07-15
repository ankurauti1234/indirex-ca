'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface ScalablePaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  isLoading?: boolean
}

export function ScalablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: ScalablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const [inputPage, setInputPage] = useState(page.toString())

  const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newPage = Math.max(1, Math.min(totalPages, parseInt(inputPage) || 1))
      onPageChange(newPage)
      setInputPage(newPage.toString())
    }
  }

  const goToPage = (p: number) => {
    const newPage = Math.max(1, Math.min(totalPages, p))
    onPageChange(newPage)
    setInputPage(newPage.toString())
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Show ellipsis if needed
      if (page > maxVisible / 2 + 1) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, page - Math.floor(maxVisible / 2))
      const end = Math.min(totalPages - 1, page + Math.floor(maxVisible / 2))

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Show ellipsis if needed
      if (page < totalPages - maxVisible / 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 select-none">
      {/* Left side info & size selector */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground/80 font-medium">Rows per page</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              onPageSizeChange(parseInt(value as string))
              goToPage(1)
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[75px] h-8 py-1 px-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-muted-foreground/30 select-none hidden xs:inline">|</span>

        {/* Info text */}
        <div>
          Showing <span className="font-semibold text-foreground/95">{Math.min((page - 1) * pageSize + 1, total)}</span> to{' '}
          <span className="font-semibold text-foreground/95">{Math.min(page * pageSize, total)}</span> of{' '}
          <span className="font-semibold text-foreground/95">{total.toLocaleString()}</span> events
        </div>
      </div>

      {/* Right side page numbers & navigation */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Jump to page input */}
        {totalPages > 10 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground/80 font-medium">Jump to page</span>
            <div className="flex items-center gap-1.5">
              <Input
                id="jumpToPage"
                type="number"
                min="1"
                max={totalPages}
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onKeyDown={handlePageInput}
                disabled={isLoading}
                className="w-14 h-8 px-2 text-center"
                placeholder="Page"
              />
              <span className="text-muted-foreground/80">
                of <span className="font-medium text-foreground">{totalPages.toLocaleString()}</span>
              </span>
            </div>
          </div>
        )}

        {totalPages > 10 && <span className="text-muted-foreground/30 select-none text-xs hidden sm:inline">|</span>}

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(1)}
            disabled={page === 1 || isLoading}
            title="First page"
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1 || isLoading}
            title="Previous page"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 px-1">
            {getPageNumbers().map((p, idx) => (
              <div key={idx}>
                {p === '...' ? (
                  <span className="px-1 text-xs text-muted-foreground/50 select-none">•••</span>
                ) : (
                  <Button
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(p as number)}
                    disabled={isLoading}
                    className="h-8 min-w-[32px] px-2 text-xs font-semibold"
                  >
                    {p}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages || isLoading}
            title="Next page"
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages || isLoading}
            title="Last page"
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
