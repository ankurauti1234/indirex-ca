'use client'

import type { PaginatedResponse } from '@/lib/types'
import { EventRow } from './event-row'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'

interface EventsTableProps {
  data: PaginatedResponse
  isLoading: boolean
}

export function EventsTable({ data, isLoading }: EventsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-[var(--radius)] border border-border/80 overflow-hidden bg-card/20 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-24 rounded animate-pulse bg-muted"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 rounded animate-pulse bg-muted"></div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded animate-pulse bg-muted"></div>
                    <div className="h-3 w-24 rounded animate-pulse bg-muted"></div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded animate-pulse bg-muted"></div>
                    <div className="h-4 w-28 rounded animate-pulse bg-muted"></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.events.length === 0) {
    return (
      <div className="rounded-[var(--radius)] border border-border/70 border-dashed p-10 text-center bg-card/10">
        <p className="text-muted-foreground">No events found.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-[var(--radius)] border border-border/80 overflow-hidden bg-card/20 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
