'use client'

import {
  formatEventTimestamp,
  getEventTypeLabel,
  renderDetectionDetails,
  renderSessionDetails,
} from '@/lib/event-utils'
import { TableRow, TableCell } from '@/components/ui/table'
import type { Event } from '@/lib/types'

interface EventRowProps {
  event: Event
}

export function EventRow({ event }: EventRowProps) {
  const timestamp = formatEventTimestamp(event.timestamp)
  const typeLabel = getEventTypeLabel(event.type)

  if (event.type === 1) {
    const details = renderDetectionDetails(event.details as any)
    return (
      <TableRow>
        <TableCell className="font-mono font-medium text-foreground/90">{event.device_id}</TableCell>
        <TableCell>
          <span className="inline-flex items-center rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30">
            {typeLabel}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground/90">{timestamp.absolute}</span>
            <span className="text-[11px] text-muted-foreground/80">
              {timestamp.relative}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-muted-foreground/70">Status: </span>
              <span className="font-medium text-foreground/90">{details.status || '—'}</span>
            </div>
            <div>
              <span className="text-muted-foreground/70">Type: </span>
              <span className="font-medium text-foreground/90">{details.contentType}</span>
            </div>
            <div>
              <span className="text-muted-foreground/70">Content: </span>
              <span className="font-mono font-medium text-foreground/90 bg-muted/40 px-1 rounded-sm border border-border/30">{details.content}</span>
            </div>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  if (event.type === 2) {
    const details = renderSessionDetails(event.details as any)
    return (
      <TableRow>
        <TableCell className="font-mono font-medium text-foreground/90">{event.device_id}</TableCell>
        <TableCell>
          <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
            {typeLabel}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground/90">{timestamp.absolute}</span>
            <span className="text-[11px] text-muted-foreground/80">
              {timestamp.relative}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-muted-foreground/70">Content: </span>
              <span className="font-mono font-medium text-foreground/90 bg-muted/40 px-1 rounded-sm border border-border/30">{details.content}</span>
            </div>
            <div>
              <span className="text-muted-foreground/70">Duration: </span>
              <span className="font-medium text-foreground/90">{details.duration}</span>
            </div>
            <div>
              <span className="text-muted-foreground/70">Time: </span>
              <span className="font-medium text-foreground/90">
                {details.startTime} - {details.endTime}
              </span>
            </div>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return null
}
