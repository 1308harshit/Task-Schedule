"use client"

import { useState } from "react"
import { CalendarIcon, UserIcon, FolderIcon, TrashIcon } from "@heroicons/react/24/outline"

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

export default function ProjectCard({ 
  project, 
  onDelete 
}: { 
  project: Project
  onDelete?: (projectId: number) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [projectDetails, setProjectDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  const handleDelete = async () => {
    if (!onDelete) return
    
    if (!confirm(`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects?id=${project.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onDelete(project.id)
      } else {
        alert('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleShowDetails = async () => {
    if (showDetails) {
      setShowDetails(false)
      return
    }

    setLoadingDetails(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setProjectDetails(data)
        setShowDetails(true)
      } else {
        alert('Failed to load project details')
      }
    } catch (error) {
      console.error('Error loading project details:', error)
      alert('Failed to load project details')
    } finally {
      setLoadingDetails(false)
    }
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

      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {isExpanded ? 'Hide' : 'Show'} modules
          </button>
          
          <button
            onClick={handleShowDetails}
            disabled={loadingDetails}
            className="text-sm text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
          >
            {loadingDetails ? 'Loading...' : showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <TrashIcon className="h-3 w-3 mr-1" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

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

      {showDetails && projectDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Project Details</h4>
          <div className="space-y-4">
            {projectDetails.modules && projectDetails.modules.length > 0 ? (
              projectDetails.modules.map((module: any) => (
                <div key={module.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-gray-900">{module.name}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[module.status as keyof typeof statusColors]}`}>
                      {module.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {module.description && (
                    <p className="text-xs text-gray-600 mb-2">{module.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-gray-500">Priority:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      module.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      module.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                      module.priority === 'LOW' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {module.priority}
                    </span>
                  </div>
                  
                  {module.functionalities && module.functionalities.length > 0 ? (
                    <div>
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Functionalities:</h6>
                      <div className="space-y-1">
                        {module.functionalities.map((func: any) => (
                          <div key={func.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-700">{func.name}</span>
                              <span className={`px-1 py-0.5 text-xs font-medium rounded ${
                                func.type === 'FRONTEND' ? 'bg-blue-100 text-blue-800' :
                                func.type === 'BACKEND' ? 'bg-green-100 text-green-800' :
                                func.type === 'API' ? 'bg-purple-100 text-purple-800' :
                                func.type === 'DATABASE' ? 'bg-orange-100 text-orange-800' :
                                func.type === 'INTEGRATION' ? 'bg-pink-100 text-pink-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {func.type}
                              </span>
                            </div>
                            <span className={`px-1 py-0.5 text-xs font-medium rounded ${
                              func.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              func.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              func.status === 'TESTING' ? 'bg-yellow-100 text-yellow-800' :
                              func.status === 'ON_HOLD' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {func.status.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No functionalities added yet</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No modules found for this project</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
