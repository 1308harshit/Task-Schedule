"use client"

import { useState, useEffect } from "react"
import { PlusIcon, UsersIcon, FolderIcon, CheckCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"
import { signOut } from "next-auth/react"
import CreateProjectModal from "./CreateProjectModal"
import CreateModuleModal from "./CreateModuleModal"
import ProjectCard from "./ProjectCard"
import ModuleCard from "./ModuleCard"
import TaskAssignmentModal from "./TaskAssignmentModal"

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

interface User {
  id: number
  name: string | null
  email: string
  role: string
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateModule, setShowCreateModule] = useState(false)
  const [showTaskAssignment, setShowTaskAssignment] = useState(false)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [projectsRes, modulesRes, usersRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/modules'),
        fetch('/api/users')
      ])

      const [projectsData, modulesData, usersData] = await Promise.all([
        projectsRes.json(),
        modulesRes.json(),
        usersRes.json()
      ])

      // Check if responses are successful and data is arrays
      if (projectsRes.ok && Array.isArray(projectsData)) {
        setProjects(projectsData)
      } else {
        console.error('Error fetching projects:', projectsData.error || 'Unknown error')
        setProjects([])
      }

      if (modulesRes.ok && Array.isArray(modulesData)) {
        setModules(modulesData)
      } else {
        console.error('Error fetching modules:', modulesData.error || 'Unknown error')
        setModules([])
      }

      if (usersRes.ok && Array.isArray(usersData)) {
        setUsers(usersData)
      } else {
        console.error('Error fetching users:', usersData.error || 'Unknown error')
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setProjects([])
      setModules([])
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (projectData: any) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        await fetchData()
        setShowCreateProject(false)
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleCreateModule = async (moduleData: any) => {
    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
      })

      if (response.ok) {
        await fetchData()
        setShowCreateModule(false)
      }
    } catch (error) {
      console.error('Error creating module:', error)
    }
  }

  const handleAssignTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        await fetchData()
        setShowTaskAssignment(false)
        setSelectedModule(null)
      }
    } catch (error) {
      console.error('Error assigning task:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const totalTasks = projects.reduce((sum, project) => sum + project._count.tasks, 0)
  const totalModules = modules.length
  const totalDevelopers = users.filter(user => user.role === 'DEVELOPER').length

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Projects
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {projects.length}
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
                    Total Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalTasks}
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
                <FolderIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Modules
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalModules}
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
                <UsersIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Developers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalDevelopers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setShowCreateProject(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Project
        </button>
        <button
          onClick={() => setShowCreateModule(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Module
        </button>
      </div>

      {/* Projects Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Modules Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              onAssignTask={(module) => {
                setSelectedModule(module)
                setShowTaskAssignment(true)
              }}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onSubmit={handleCreateProject}
        />
      )}

      {showCreateModule && (
        <CreateModuleModal
          projects={projects}
          onClose={() => setShowCreateModule(false)}
          onSubmit={handleCreateModule}
        />
      )}

      {showTaskAssignment && selectedModule && (
        <TaskAssignmentModal
          module={selectedModule}
          users={users.filter(user => user.role === 'DEVELOPER')}
          onClose={() => {
            setShowTaskAssignment(false)
            setSelectedModule(null)
          }}
          onSubmit={handleAssignTask}
        />
      )}
    </div>
  )
}
