import { supabase } from '@/lib/supabase-server'
import type { EventType, PaginatedResponse } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '25')
    const search = searchParams.get('search')?.toLowerCase() || ''
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const offset = (page - 1) * pageSize

    // Start building the query
    let query = supabase.from('events').select('*', { count: 'exact' })

    // Add search filter (device_id case-insensitive partial match)
    if (search) {
      query = query.ilike('device_id', `%${search}%`)
    }

    // Add type filter
    if (type && type !== 'all') {
      const typeNum = parseInt(type)
      query = query.eq('type', typeNum)
    }

    // Add date range filters
    if (startDate) {
      query = query.gte('timestamp', startDate)
    }
    if (endDate) {
      query = query.lte('timestamp', endDate)
    }

    // Sort by timestamp DESC (latest first) and apply pagination
    const { data, count, error } = await query
      .order('timestamp', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const response: PaginatedResponse = {
      events: data || [],
      total: count || 0,
      page,
      pageSize,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
