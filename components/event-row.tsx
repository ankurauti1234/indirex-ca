'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import {
  formatEventTimestamp,
  getEventTypeLabel,
  renderDetectionDetails,
  renderSessionDetails,
} from '@/lib/event-utils'
import { TableRow, TableCell } from '@/components/ui/table'
import type { Event } from '@/lib/types'
import { useTimezone } from '@/lib/timezone-context'

interface EventRowProps {
  event: Event
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      if (!copied) setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-muted text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 cursor-pointer"
      title="Copy ID to clipboard"
    >
      {copied ? (
        <Check className="h-3 w-3 text-primary" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  )
}

export function EventRow({ event }: EventRowProps) {
  const { timezone } = useTimezone()
  const timestamp = formatEventTimestamp(event.timestamp, timezone)
  const typeLabel = event.event_types?.name
    ? event.event_types.name.charAt(0).toUpperCase() + event.event_types.name.slice(1)
    : getEventTypeLabel(event.type)

  const renderDetails = () => {
    if (event.type === 1) {
      const details = renderDetectionDetails(event.details as any)
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <div>
            <span className="text-muted-foreground/60 font-medium">Status:</span>{' '}
            <span className="text-foreground/90 font-medium">{details.status || '—'}</span>
          </div>
          <div>
            <span className="text-muted-foreground/60 font-medium">Type:</span>{' '}
            <span className="text-foreground/90 font-medium">{details.contentType}</span>
          </div>
          <div>
            <span className="text-muted-foreground/60 font-medium">Content:</span>{' '}
            <span className="font-mono text-xs text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
              {details.content}
            </span>
          </div>
        </div>
      )
    }

    if (event.type === 2) {
      const details = renderSessionDetails(event.details as any, timezone)
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <div>
            <span className="text-muted-foreground/60 font-medium">Content:</span>{' '}
            <span className="font-mono text-xs text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
              {details.content}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground/60 font-medium">Duration:</span>{' '}
            <span className="text-foreground/90 font-medium">{details.duration}</span>
          </div>
          <div>
            <span className="text-muted-foreground/60 font-medium">Time:</span>{' '}
            <span className="text-foreground/90 font-medium">
              {details.startTime} - {details.endTime}
            </span>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <TableRow className="group hover:bg-muted/40 border-b border-border/40">
      {/* Device ID without Avatar */}
      <TableCell className="font-mono font-medium text-foreground/90 w-[260px] pl-6 pr-4 border-r border-border/40">
        <div className="flex items-center gap-1.5">
          <span className="truncate hover:text-foreground text-sm max-w-[180px]">{event.device_id}</span>
          <CopyButton text={event.device_id} />
        </div>
      </TableCell>

      {/* Event Type Badge */}
      <TableCell className="px-4 text-xs font-medium text-muted-foreground border-r border-border/40 w-[130px]">
        {typeLabel}
      </TableCell>

      {/* Timestamp */}
      <TableCell className="px-4 border-r border-border/40 w-[220px]">
        <div className="flex flex-col gap-0.5 justify-center font-mono">
          <span className="text-sm text-foreground/80">{timestamp.absolute}</span>
        </div>
      </TableCell>

      {/* Dynamic Details */}
      <TableCell className="px-4 pr-6">{renderDetails()}</TableCell>
    </TableRow>
  )
}
