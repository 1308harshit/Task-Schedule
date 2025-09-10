"use client"

import { useState, useEffect } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface Project {
  id: number
  name: string
}

interface Module {
  id: number
  name: string
  project: {
    id: number
    name: string
  }
  functionalities: Functionality[]
}

interface Functionality {
  id: number
  name: string
  type: string
}

interface User {
  id: number
  name: string | null
  email: string
}

interface CreateTaskModalProps {
  projects: Project[]
  modules: Module[]
  users: User[]
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function CreateTaskModal({ 
  projects, 
  modules, 
  users, 
  onClose, 
  onSubmit 
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    moduleId: '',
    functionalityId: '',
    priority: 'MEDIUM',
    estimatedHours: '',
    dueDate: '',
    assignedUserIds: [] as number[]
  })

  const [availableModules, setAvailableModules] = useState<Module[]>([])
  const [availableFunctionalities, setAvailableFunctionalities] = useState<Functionality[]>([])

  // Filter modules when project changes
  useEffect(() => {
    if (formData.projectId) {
      const filteredModules = modules.filter(module => 
        module.project.id === parseInt(formData.projectId)
      )
      setAvailableModules(filteredModules)
      // Reset module and functionality when project changes
      setFormData(prev => ({
        ...prev,
        moduleId: '',
        functionalityId: ''
      }))
      setAvailableFunctionalities([])
    } else {
      setAvailableModules([])
      setAvailableFunctionalities([])
    }
  }, [formData.projectId, modules])

  // Filter functionalities when module changes
  useEffect(() => {
    if (formData.moduleId) {
      const selectedModule = availableModules.find(module => 
        module.id === parseInt(formData.moduleId)
      )
      if (selectedModule) {
        setAvailableFunctionalities(selectedModule.functionalities)
      }
      // Reset functionality when module changes
      setFormData(prev => ({
        ...prev,
        functionalityId: ''
      }))
    } else {
      setAvailableFunctionalities([])
    }
  }, [formData.moduleId, availableModules])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      projectId: parseInt(formData.projectId),
      moduleId: formData.moduleId ? parseInt(formData.moduleId) : null,
      functionalityId: formData.functionalityId ? parseInt(formData.functionalityId) : null,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
      assignedUserIds: formData.assignedUserIds
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleUserToggle = (userId: number) => {
    setFormData({
      ...formData,
      assignedUserIds: formData.assignedUserIds.includes(userId)
        ? formData.assignedUserIds.filter(id => id !== userId)
        : [...formData.assignedUserIds, userId]
    })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
              Project *
            </label>
            <select
              id="projectId"
              name="projectId"
              required
              value={formData.projectId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="moduleId" className="block text-sm font-medium text-gray-700">
              Module
            </label>
            <select
              id="moduleId"
              name="moduleId"
              value={formData.moduleId}
              onChange={handleChange}
              disabled={!formData.projectId}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a module (optional)</option>
              {availableModules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
            {!formData.projectId && (
              <p className="mt-1 text-sm text-gray-500">Please select a project first</p>
            )}
          </div>

          <div>
            <label htmlFor="functionalityId" className="block text-sm font-medium text-gray-700">
              Functionality
            </label>
            <select
              id="functionalityId"
              name="functionalityId"
              value={formData.functionalityId}
              onChange={handleChange}
              disabled={!formData.moduleId}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a functionality (optional)</option>
              {availableFunctionalities.map((functionality) => (
                <option key={functionality.id} value={functionality.id}>
                  {functionality.name} ({functionality.type})
                </option>
              ))}
            </select>
            {!formData.moduleId && (
              <p className="mt-1 text-sm text-gray-500">Please select a module first</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
                Estimated Hours
              </label>
              <input
                type="number"
                id="estimatedHours"
                name="estimatedHours"
                min="1"
                value={formData.estimatedHours}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Developers
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.assignedUserIds.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {user.name || user.email}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
