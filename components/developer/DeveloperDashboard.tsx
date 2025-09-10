"use client"

import { useState, useEffect } from "react"
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, PlayIcon } from "@heroicons/react/24/outline"
import TaskCard from "./TaskCard"
import TimeTrackingModal from "./TimeTrackingModal"

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

export default function DeveloperDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showTimeTracking, setShowTimeTracking] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks?userId=me')
      const data = await response.json()
      
      if (response.ok && Array.isArray(data)) {
        setTasks(data)
      } else {
        console.error('Error fetching tasks:', data.error || 'Unknown error')
        setTasks([]) // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleTaskStatusUpdate = async (taskId: number, status: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        await fetchTasks()
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleStartTimeTracking = (task: Task) => {
    setSelectedTask(task)
    setShowTimeTracking(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const pendingTasks = tasks.filter(task => task.status === 'PENDING')
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS')
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED')
  const delayedTasks = tasks.filter(task => task.status === 'DELAYED')

  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0)
  const totalActualHours = tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pendingTasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlayIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Progress
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {inProgressTasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {completedTasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Delayed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {delayedTasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Tracking Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Time Tracking Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Estimated Hours</p>
            <p className="text-2xl font-semibold text-gray-900">{totalEstimatedHours}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Actual Hours</p>
            <p className="text-2xl font-semibold text-gray-900">{totalActualHours}h</p>
          </div>
        </div>
      </div>

      {/* Tasks by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Tasks</h3>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusUpdate={handleTaskStatusUpdate}
                onStartTimeTracking={handleStartTimeTracking}
              />
            ))}
            {pendingTasks.length === 0 && (
              <p className="text-gray-500 text-center py-8">No pending tasks</p>
            )}
          </div>
        </div>

        {/* In Progress Tasks */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">In Progress</h3>
          <div className="space-y-4">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusUpdate={handleTaskStatusUpdate}
                onStartTimeTracking={handleStartTimeTracking}
              />
            ))}
            {inProgressTasks.length === 0 && (
              <p className="text-gray-500 text-center py-8">No tasks in progress</p>
            )}
          </div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Completed Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusUpdate={handleTaskStatusUpdate}
              onStartTimeTracking={handleStartTimeTracking}
            />
          ))}
          {completedTasks.length === 0 && (
            <p className="text-gray-500 text-center py-8 col-span-full">No completed tasks</p>
          )}
        </div>
      </div>

      {/* Time Tracking Modal */}
      {showTimeTracking && selectedTask && (
        <TimeTrackingModal
          task={selectedTask}
          onClose={() => {
            setShowTimeTracking(false)
            setSelectedTask(null)
          }}
          onTimeLogged={() => {
            fetchTasks()
            setShowTimeTracking(false)
            setSelectedTask(null)
          }}
        />
      )}
    </div>
  )
}
