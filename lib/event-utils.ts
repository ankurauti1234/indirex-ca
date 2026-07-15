import { formatDistanceToNow, format } from 'date-fns'
import type {
  DetectionDetails,
  EventType,
  SessionDetails,
} from './types'

export function getEventTypeLabel(type: EventType): string {
  return type === 1 ? 'Detection' : 'Session'
}

export function formatEventTimestamp(
  timestamp: string,
  timezone: string = 'locale'
): {
  absolute: string
  relative: string
} {
  const date = new Date(timestamp)

  let timeZoneId: string | undefined = undefined
  if (timezone === 'IST') {
    timeZoneId = 'Asia/Kolkata'
  } else if (timezone === 'Canada') {
    timeZoneId = 'America/Toronto'
  } else if (timezone === 'UTC') {
    timeZoneId = 'UTC'
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timeZoneId,
    })

    const parts = formatter.formatToParts(date)
    const partMap = Object.fromEntries(parts.map((p) => [p.type, p.value]))

    const absolute = `${partMap.month} ${partMap.day}, ${partMap.year} ${partMap.hour}:${partMap.minute}:${partMap.second}`

    return {
      absolute,
      relative: formatDistanceToNow(date, { addSuffix: true }),
    }
  } catch (e) {
    return {
      absolute: format(date, 'MMM d, yyyy HH:mm:ss'),
      relative: formatDistanceToNow(date, { addSuffix: true }),
    }
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
  details: SessionDetails,
  timezone: string = 'locale'
): {
  content: string
  duration: string
  startTime: string
  endTime: string
} {
  const startD = new Date(details.session_start * 1000)
  const endD = new Date(details.session_end * 1000)

  let timeZoneId: string | undefined = undefined
  if (timezone === 'IST') {
    timeZoneId = 'Asia/Kolkata'
  } else if (timezone === 'Canada') {
    timeZoneId = 'America/Toronto'
  } else if (timezone === 'UTC') {
    timeZoneId = 'UTC'
  }

  let startTime: string
  let endTime: string

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timeZoneId,
    })
    startTime = formatter.format(startD)
    endTime = formatter.format(endD)
  } catch (e) {
    startTime = format(startD, 'HH:mm:ss')
    endTime = format(endD, 'HH:mm:ss')
  }

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
