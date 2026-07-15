export type EventType = 1 | 2

export interface EventDetails {
  [key: string]: any
}

export interface Event {
  id: string
  device_id: string
  type: EventType
  timestamp: string
  details: EventDetails
  created_at: string
}

export interface DetectionDetails extends EventDetails {
  content_type: string
  content: string
  status?: string
}

export interface SessionDetails extends EventDetails {
  session_start: number
  session_end: number
  content: string
}

export interface PaginationParams {
  page: number
  pageSize: number
  search?: string
  type?: EventType | 'all'
  startDate?: string
  endDate?: string
}

export interface PaginatedResponse {
  events: Event[]
  total: number
  page: number
  pageSize: number
}
