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
  const timestamp = formatEventTimestamp(event.timestamp)
  const typeLabel = getEventTypeLabel(event.type)

  const renderDetails = () => {
    if (event.type === 1) {
      const details = renderDetectionDetails(event.details as any)
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <div>
            <span className="text-muted-foreground/50 font-medium">Status:</span>{' '}
            <span className="text-foreground/80 font-medium">{details.status || '—'}</span>
          </div>
          <div>
            <span className="text-muted-foreground/50 font-medium">Type:</span>{' '}
            <span className="text-foreground/80 font-medium">{details.contentType}</span>
          </div>
          <div>
            <span className="text-muted-foreground/50 font-medium">Content:</span>{' '}
            <span className="font-mono text-[11px] text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
              {details.content}
            </span>
          </div>
        </div>
      )
    }

    if (event.type === 2) {
      const details = renderSessionDetails(event.details as any)
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <div>
            <span className="text-muted-foreground/50 font-medium">Content:</span>{' '}
            <span className="font-mono text-[11px] text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
              {details.content}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground/50 font-medium">Duration:</span>{' '}
            <span className="text-foreground/80 font-medium">{details.duration}</span>
          </div>
          <div>
            <span className="text-muted-foreground/50 font-medium">Time:</span>{' '}
            <span className="text-foreground/80 font-medium">
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
      <TableCell className="font-mono font-medium text-foreground/90 max-w-[240px] pl-6 pr-4">
        <div className="flex items-center gap-1.5">
          <span className="truncate hover:text-foreground text-xs">{event.device_id}</span>
          <CopyButton text={event.device_id} />
        </div>
      </TableCell>

      {/* Event Type Badge */}
      <TableCell className="px-4">
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
            event.type === 1
              ? 'border border-sky-500/20 bg-sky-500/5 text-sky-400'
              : 'border border-primary/20 bg-primary/5 text-primary'
          }`}
        >
          {typeLabel}
        </span>
      </TableCell>

      {/* Dynamic Details */}
      <TableCell className="max-w-[400px] truncate px-4">{renderDetails()}</TableCell>

      {/* Timestamp */}
      <TableCell className="text-right pr-6 pl-4">
        <div className="flex flex-col gap-0.5 items-end justify-center font-mono">
          <span className="text-xs text-foreground/80">{timestamp.absolute}</span>
          <span className="text-[10px] text-muted-foreground/60 font-sans">{timestamp.relative}</span>
        </div>
      </TableCell>
    </TableRow>
  )
}
