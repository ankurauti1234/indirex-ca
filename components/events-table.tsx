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
      <div className="w-full bg-muted/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 font-bold uppercase tracking-wider text-[10px] text-muted-foreground/80">Device ID</TableHead>
              <TableHead className="px-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground/80">Type</TableHead>
              <TableHead className="px-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground/80">Details</TableHead>
              <TableHead className="text-right pr-6 pl-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground/80">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="px-6">
                  <div className="h-4 w-32 rounded animate-pulse bg-muted/60"></div>
                </TableCell>
                <TableCell className="px-4">
                  <div className="h-4 w-16 rounded animate-pulse bg-muted/60"></div>
                </TableCell>
                <TableCell className="px-4">
                  <div className="space-y-1">
                    <div className="h-3.5 w-48 rounded animate-pulse bg-muted/60"></div>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6 pl-4">
                  <div className="space-y-1 ml-auto w-32 flex flex-col items-end">
                    <div className="h-3.5 w-24 rounded animate-pulse bg-muted/60"></div>
                    <div className="h-3 w-16 rounded animate-pulse bg-muted/60"></div>
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
      <div className="w-full py-16 text-center border-b border-border/50 bg-muted/5">
        <p className="text-muted-foreground text-sm font-medium">No events found.</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full bg-card/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 font-bold uppercase tracking-wider text-[10px] text-muted-foreground/80">Device ID</TableHead>
            <TableHead className="px-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground/80">Type</TableHead>
            <TableHead className="px-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground/80">Details</TableHead>
            <TableHead className="text-right pr-6 pl-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground/80">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.events.map((event) => (
            <EventRow
              key={event.id}
              event={event}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
