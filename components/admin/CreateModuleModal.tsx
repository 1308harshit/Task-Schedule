"use client"

import { useState } from "react"
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"

interface Project {
  id: number
  name: string
}

interface Functionality {
  name: string
  description: string
  type: string
  status: string
}

interface CreateModuleModalProps {
  projects: Project[]
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function CreateModuleModal({ projects, onClose, onSubmit }: CreateModuleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: '',
    priority: 'MEDIUM'
  })

  const [functionalities, setFunctionalities] = useState<Functionality[]>([])
  const [newFunctionality, setNewFunctionality] = useState({
    name: '',
    description: '',
    type: 'FRONTEND',
    status: 'PLANNING'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      functionalities: functionalities
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFunctionalityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewFunctionality({
      ...newFunctionality,
      [e.target.name]: e.target.value
    })
  }

  const addFunctionality = () => {
    if (newFunctionality.name.trim()) {
      setFunctionalities([...functionalities, { ...newFunctionality }])
      setNewFunctionality({
        name: '',
        description: '',
        type: 'FRONTEND',
        status: 'PLANNING'
      })
    }
  }

  const removeFunctionality = (index: number) => {
    setFunctionalities(functionalities.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Module</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Module Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
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

          {/* Functionalities Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Functionalities (Optional)
              </label>
              <button
                type="button"
                onClick={addFunctionality}
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Add Functionality
              </button>
            </div>

            {/* Add New Functionality Form */}
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newFunctionality.name}
                    onChange={handleFunctionalityChange}
                    placeholder="e.g., User Authentication"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={newFunctionality.type}
                    onChange={handleFunctionalityChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="FRONTEND">Frontend</option>
                    <option value="BACKEND">Backend</option>
                    <option value="API">API</option>
                    <option value="DATABASE">Database</option>
                    <option value="INTEGRATION">Integration</option>
                    <option value="TESTING">Testing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newFunctionality.status}
                    onChange={handleFunctionalityChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="TESTING">Testing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={newFunctionality.description}
                    onChange={handleFunctionalityChange}
                    placeholder="Brief description"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* List of Added Functionalities */}
            {functionalities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Added Functionalities:</h4>
                {functionalities.map((func, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{func.name}</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {func.type}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {func.status.replace('_', ' ')}
                        </span>
                      </div>
                      {func.description && (
                        <p className="text-xs text-gray-500 mt-1">{func.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFunctionality(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Module
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
