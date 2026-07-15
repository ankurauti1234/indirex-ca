import { formatDistanceToNow, format } from 'date-fns'
import type {
  DetectionDetails,
  EventType,
  SessionDetails,
} from './types'

export function getEventTypeLabel(type: EventType): string {
  return type === 1 ? 'Detection' : 'Session'
}

export function formatEventTimestamp(timestamp: string): {
  absolute: string
  relative: string
} {
  const date = new Date(timestamp)
  return {
    absolute: format(date, 'MMM d, yyyy HH:mm:ss'),
    relative: formatDistanceToNow(date, { addSuffix: true }),
  }
}

export function formatSessionDuration(
  startUnix: number,
  endUnix: number
): string {
  const durationSeconds = endUnix - startUnix
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = durationSeconds % 60

  if (minutes === 0) {
    return `${seconds}s`
  }
  return `${minutes}m ${seconds}s`
}

export function renderDetectionDetails(
  details: DetectionDetails
): {
  status?: string
  contentType: string
  content: string
} {
  return {
    status: details.status,
    contentType: details.content_type || 'Unknown',
    content: details.content || '—',
  }
}

export function renderSessionDetails(
  details: SessionDetails
): {
  content: string
  duration: string
  startTime: string
  endTime: string
} {
  const startTime = format(
    new Date(details.session_start * 1000),
    'HH:mm:ss'
  )
  const endTime = format(new Date(details.session_end * 1000), 'HH:mm:ss')
  const duration = formatSessionDuration(
    details.session_start,
    details.session_end
  )

  return {
    content: details.content || '—',
    duration,
    startTime,
    endTime,
  }
}
