"use client"

import { useState } from "react"
import { TrashIcon, ClockIcon } from "@heroicons/react/24/outline"

interface Task {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  estimatedHours: number | null
  actualHours: number | null
  startDate: string | null
  dueDate: string | null
  completedAt: string | null
  project: {
    id: number
    name: string
  }
  module: {
    id: number
    name: string
  } | null
  functionality: {
    id: number
    name: string
    type: string
  } | null
  assignments: {
    user: {
      id: number
      name: string | null
      email: string
    }
  }[]
  timeLogs: {
    id: number
    startTime: string
    endTime: string | null
    duration: number | null
    description: string | null
  }[]
}

interface AdminTaskCardProps {
  task: Task
  onDelete?: (taskId: number) => void
}

const statusColors = {
  PENDING: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  DELAYED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800"
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800"
}

export default function AdminTaskCard({ task, onDelete }: AdminTaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "0h 0m"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleDelete = async () => {
    if (!onDelete) return
    
    if (!confirm(`Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tasks?id=${task.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onDelete(task.id)
      } else {
        alert('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Failed to delete task')
    } finally {
      setIsDeleting(false)
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'

  return (
    <div className={`bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          )}
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status as keyof typeof statusColors]}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
              {task.priority}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Overdue
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <div>Project: {task.project.name}</div>
            {task.module && <div>Module: {task.module.name}</div>}
            {task.functionality && (
              <div>Functionality: {task.functionality.name} ({task.functionality.type})</div>
            )}
            <div>Due: {formatDate(task.dueDate)}</div>
            {task.estimatedHours && (
              <div>Estimated: {task.estimatedHours}h</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-2">
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <TrashIcon className="h-3 w-3 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? 'Hide' : 'Show'} details
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Time Logs</h4>
              {task.timeLogs.length > 0 ? (
                <div className="space-y-2">
                  {task.timeLogs.map((log) => (
                    <div key={log.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <div className="flex justify-between">
                        <span>{formatDate(log.startTime)}</span>
                        <span>{formatDuration(log.duration)}</span>
                      </div>
                      {log.description && (
                        <p className="text-xs text-gray-500 mt-1">{log.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No time logs recorded</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Assigned To</h4>
              <div className="space-y-1">
                {task.assignments.map((assignment, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {assignment.user.name || assignment.user.email}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
