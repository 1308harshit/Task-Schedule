"use client"

import { useState } from "react"
import { FolderIcon, UserIcon, PlusIcon } from "@heroicons/react/24/outline"

interface Module {
  id: number
  name: string
  description: string | null
  status: string
  priority: string
  project: {
    id: number
    name: string
  }
  functionalities: Functionality[]
  _count: {
    tasks: number
  }
}

interface Functionality {
  id: number
  name: string
  type: string
  status: string
}

const statusColors = {
  PLANNING: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  TESTING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  ON_HOLD: "bg-red-100 text-red-800"
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800"
}

const typeColors = {
  FRONTEND: "bg-blue-100 text-blue-800",
  BACKEND: "bg-green-100 text-green-800",
  API: "bg-purple-100 text-purple-800",
  DATABASE: "bg-orange-100 text-orange-800",
  INTEGRATION: "bg-pink-100 text-pink-800",
  TESTING: "bg-yellow-100 text-yellow-800"
}

export default function ModuleCard({ 
  module, 
  onAssignTask 
}: { 
  module: Module
  onAssignTask: (module: Module) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
          {module.description && (
            <p className="text-gray-600 text-sm mb-4">{module.description}</p>
          )}
          
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[module.status as keyof typeof statusColors]}`}>
              {module.status.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[module.priority as keyof typeof priorityColors]}`}>
              {module.priority}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <FolderIcon className="h-4 w-4 mr-1" />
            <span>{module.project.name}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <span>{module._count.tasks} tasks</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onAssignTask(module)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-3 w-3 mr-1" />
          Assign Task
        </button>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isExpanded ? 'Hide' : 'Show'} functionalities
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Functionalities</h4>
          <div className="space-y-2">
            {module.functionalities.map((functionality) => (
              <div key={functionality.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">{functionality.name}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[functionality.type as keyof typeof typeColors]}`}>
                    {functionality.type}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[functionality.status as keyof typeof statusColors]}`}>
                  {functionality.status.replace('_', ' ')}
                </span>
              </div>
            ))}
            {module.functionalities.length === 0 && (
              <p className="text-gray-500 text-sm">No functionalities added yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
