"use client"

import { useState, useEffect } from "react"
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline"

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
    user: {
      id: number
      name: string | null
    }
  }[]
  _count: {
    comments: number
  }
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

export default function TaskManagementView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [projectFilter, setProjectFilter] = useState("ALL")
  const [expandedTask, setExpandedTask] = useState<number | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      
      if (response.ok && Array.isArray(data)) {
        setTasks(data)
      } else {
        console.error('Error fetching tasks:', data.error || 'Unknown error')
        setTasks([])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'IN_PROGRESS':
        return <ClockIcon className="h-5 w-5 text-blue-600" />
      case 'DELAYED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter
    const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter
    const matchesProject = projectFilter === "ALL" || task.project.id.toString() === projectFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'COMPLETED').length
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
    const pending = tasks.filter(t => t.status === 'PENDING').length
    const delayed = tasks.filter(t => t.status === 'DELAYED').length
    
    return { total, completed, inProgress, pending, delayed }
  }

  const getUniqueProjects = () => {
    const projects = tasks.map(task => task.project)
    return projects.filter((project, index, self) => 
      index === self.findIndex(p => p.id === project.id)
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stats = getTaskStats()
  const projects = getUniqueProjects()

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-lg font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-lg font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Delayed</p>
              <p className="text-lg font-semibold text-gray-900">{stats.delayed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MagnifyingGlassIcon className="h-4 w-4 inline mr-1" />
              Search Tasks
            </label>
            <input
              type="text"
              placeholder="Search by title, description, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FunnelIcon className="h-4 w-4 inline mr-1" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="DELAYED">Delayed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Task Management ({filteredTasks.length} tasks)
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTasks.map((task) => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'
            const isExpanded = expandedTask === task.id
            
            return (
              <div key={task.id} className={`p-6 hover:bg-gray-50 ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                      {isOverdue && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <span className="font-medium">Project:</span>
                        <span className="ml-1">{task.project.name}</span>
                      </div>
                      {task.module && (
                        <div className="flex items-center">
                          <span className="font-medium">Module:</span>
                          <span className="ml-1">{task.module.name}</span>
                        </div>
                      )}
                      {task.functionality && (
                        <div className="flex items-center">
                          <span className="font-medium">Functionality:</span>
                          <span className="ml-1">{task.functionality.name} ({task.functionality.type})</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status as keyof typeof statusColors]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                      </div>
                      {task.estimatedHours && (
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>Est: {task.estimatedHours}h</span>
                        </div>
                      )}
                      {task.actualHours && (
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>Actual: {task.actualHours}h</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                    className="ml-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Assigned Users */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          Assigned To
                        </h5>
                        <div className="space-y-1">
                          {task.assignments.length > 0 ? (
                            task.assignments.map((assignment, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                {assignment.user.name || assignment.user.email}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No assignments</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Time Logs */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Time Logs
                        </h5>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {task.timeLogs.length > 0 ? (
                            task.timeLogs.map((log) => (
                              <div key={log.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <div className="flex justify-between">
                                  <span>{log.user.name || 'Unknown User'}</span>
                                  <span>{formatDuration(log.duration)}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(log.startTime)}
                                </div>
                                {log.description && (
                                  <p className="text-xs text-gray-500 mt-1">{log.description}</p>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No time logs recorded</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
