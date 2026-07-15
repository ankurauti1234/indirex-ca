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
      <div className="w-full bg-muted/5 border border-border/60 rounded-md overflow-hidden">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="bg-muted/15">
              <TableHead className="pl-6 pr-4 font-medium text-xs text-muted-foreground border-r border-border/40 w-[260px]">Device ID</TableHead>
              <TableHead className="px-4 font-medium text-xs text-muted-foreground border-r border-border/40 w-[130px]">Type</TableHead>
              <TableHead className="px-4 font-medium text-xs text-muted-foreground border-r border-border/40 w-[220px]">Timestamp</TableHead>
              <TableHead className="pr-6 pl-4 font-medium text-xs text-muted-foreground">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-b border-border/40">
                <TableCell className="pl-6 pr-4 border-r border-border/40 w-[260px]">
                  <div className="h-4 w-40 rounded animate-pulse bg-muted/60"></div>
                </TableCell>
                <TableCell className="px-4 border-r border-border/40 w-[130px]">
                  <div className="h-4 w-16 rounded animate-pulse bg-muted/60"></div>
                </TableCell>
                <TableCell className="px-4 border-r border-border/40 w-[220px]">
                  <div className="space-y-1">
                    <div className="h-3.5 w-32 rounded animate-pulse bg-muted/60"></div>
                  </div>
                </TableCell>
                <TableCell className="pr-6 pl-4">
                  <div className="h-4 w-72 rounded animate-pulse bg-muted/60"></div>
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
      <div className="w-full py-16 text-center border border-border/60 rounded-md bg-muted/5">
        <p className="text-muted-foreground text-sm font-medium">No events found.</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full bg-card/10 border border-border/60 rounded-md overflow-hidden">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="bg-muted/15">
            <TableHead className="pl-6 pr-4 font-medium text-xs text-muted-foreground border-r border-border/40 w-[260px]">Device ID</TableHead>
            <TableHead className="px-4 font-medium text-xs text-muted-foreground border-r border-border/40 w-[130px]">Type</TableHead>
            <TableHead className="px-4 font-medium text-xs text-muted-foreground border-r border-border/40 w-[220px]">Timestamp</TableHead>
            <TableHead className="pr-6 pl-4 font-medium text-xs text-muted-foreground">Details</TableHead>
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
