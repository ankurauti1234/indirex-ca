'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface AutoRefreshControlProps {
  onRefresh: () => void
  isLoading?: boolean
}

export function AutoRefreshControl({
  onRefresh,
  isLoading = false,
  compact = false,
}: AutoRefreshControlProps & { compact?: boolean }) {
  const [selectedInterval, setSelectedInterval] = useState<'off' | '10s' | '30s' | '1m' | '5m'>('off')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    const intervalMs = {
      'off': null,
      '10s': 10000,
      '30s': 30000,
      '1m': 60000,
      '5m': 300000,
    }[selectedInterval]

    if (!intervalMs) {
      setTimeLeft(null)
      return
    }

    let remainingTime = intervalMs
    setTimeLeft(remainingTime)

    const refreshTimer = window.setInterval(() => {
      onRefresh()
      remainingTime = intervalMs
      setTimeLeft(remainingTime)
    }, intervalMs)

    const countdownTimer = window.setInterval(() => {
      remainingTime -= 1000
      setTimeLeft(remainingTime > 0 ? remainingTime : intervalMs)
    }, 1000)

    return () => {
      window.clearInterval(refreshTimer)
      window.clearInterval(countdownTimer)
    }
  }, [selectedInterval, onRefresh])

  const getDisplayTime = () => {
    if (!timeLeft) return ''
    const seconds = Math.ceil(timeLeft / 1000)
    return `(${seconds}s)`
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 select-none">
        {timeLeft && (
          <span className="text-[10px] text-muted-foreground/60 font-mono w-6 text-right">
            {Math.ceil(timeLeft / 1000)}s
          </span>
        )}
        <Select value={selectedInterval} onValueChange={(value) => setSelectedInterval(value as 'off' | '10s' | '30s' | '1m' | '5m')} disabled={isLoading}>
          <SelectTrigger className="h-8 w-fit text-xs bg-background border border-border text-muted-foreground hover:text-foreground flex items-center justify-between">
            <span className="text-xs">
              {selectedInterval === 'off' && 'Refresh: Off'}
              {selectedInterval === '10s' && '10s'}
              {selectedInterval === '30s' && '30s'}
              {selectedInterval === '1m' && '1m'}
              {selectedInterval === '5m' && '5m'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="off">Refresh: Off</SelectItem>
            <SelectItem value="10s">Every 10s</SelectItem>
            <SelectItem value="30s">Every 30s</SelectItem>
            <SelectItem value="1m">Every 1 min</SelectItem>
            <SelectItem value="5m">Every 5 min</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-3">
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Auto Refresh
        </Label>
        <Select value={selectedInterval} onValueChange={(value) => setSelectedInterval(value as 'off' | '10s' | '30s' | '1m' | '5m')} disabled={isLoading}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="off">Off</SelectItem>
            <SelectItem value="10s">Every 10s</SelectItem>
            <SelectItem value="30s">Every 30s</SelectItem>
            <SelectItem value="1m">Every 1 min</SelectItem>
            <SelectItem value="5m">Every 5 min</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {timeLeft && (
        <div className="text-xs text-muted-foreground font-medium h-10 flex items-center">
          {getDisplayTime()}
        </div>
      )}
    </div>
  )
}
