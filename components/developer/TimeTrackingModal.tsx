"use client"

import { useState, useEffect } from "react"
import { XMarkIcon, PlayIcon, StopIcon } from "@heroicons/react/24/outline"

interface Task {
  id: number
  title: string
  timeLogs: {
    id: number
    startTime: string
    endTime: string | null
    duration: number | null
    description: string | null
  }[]
}

interface TimeTrackingModalProps {
  task: Task
  onClose: () => void
  onTimeLogged: () => void
}

export default function TimeTrackingModal({ task, onClose, onTimeLogged }: TimeTrackingModalProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [description, setDescription] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTracking, startTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTracking = () => {
    setStartTime(new Date())
    setIsTracking(true)
    setElapsedTime(0)
  }

  const stopTracking = async () => {
    if (!startTime) return

    try {
      const response = await fetch(`/api/tasks/${task.id}/time-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          endTime: new Date().toISOString(),
          description: description || null
        })
      })

      if (response.ok) {
        onTimeLogged()
      }
    } catch (error) {
      console.error('Error logging time:', error)
    }

    setIsTracking(false)
    setStartTime(null)
    setDescription('')
    setElapsedTime(0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "0h 0m"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Time Tracking - {task.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Current Time Tracking */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Current Session</h4>
            
            {isTracking ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-blue-600">
                    {formatTime(elapsedTime)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Time elapsed</p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What are you working on?"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={stopTracking}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <StopIcon className="h-4 w-4 mr-2" />
                    Stop Tracking
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-gray-400 mb-4">
                  00:00:00
                </div>
                <button
                  onClick={startTracking}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Start Tracking
                </button>
              </div>
            )}
          </div>

          {/* Previous Time Logs */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Previous Sessions</h4>
            {task.timeLogs.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {task.timeLogs.map((log) => (
                  <div key={log.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(log.startTime)}
                        </div>
                        {log.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {log.description}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDuration(log.duration)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                No time logs recorded yet
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
