"use client"

import { useState } from "react"
import { CalendarIcon, UserIcon, FolderIcon } from "@heroicons/react/24/outline"

interface Project {
  id: number
  name: string
  description: string | null
  status: string
  progress: number
  startDate: string | null
  endDate: string | null
  creator: {
    id: number
    name: string | null
    email: string
  }
  modules: Module[]
  _count: {
    tasks: number
    requirements: number
    frontendResources: number
    backendResources: number
    apiEndpoints: number
    databaseTables: number
  }
}

interface Module {
  id: number
  name: string
  status: string
}

const statusColors = {
  PLANNING: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  TESTING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  ON_HOLD: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800"
}

export default function ProjectCard({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
          {project.description && (
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              {project.creator.name || project.creator.email}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status as keyof typeof statusColors]}`}>
              {project.status.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-500">{project.progress}% complete</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <FolderIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-gray-600">{project._count.tasks} tasks</span>
            </div>
            <div className="flex items-center">
              <FolderIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-gray-600">{project.modules.length} modules</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {isExpanded ? 'Hide' : 'Show'} modules
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Modules</h4>
          <div className="space-y-2">
            {project.modules.map((module) => (
              <div key={module.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{module.name}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[module.status as keyof typeof statusColors]}`}>
                  {module.status.replace('_', ' ')}
                </span>
              </div>
            ))}
            {project.modules.length === 0 && (
              <p className="text-gray-500 text-sm">No modules created yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
