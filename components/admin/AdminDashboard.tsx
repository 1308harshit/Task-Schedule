"use client"

import { useState, useEffect } from "react"
import { PlusIcon, UsersIcon, FolderIcon, CheckCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"
import { signOut } from "next-auth/react"
import CreateProjectModal from "./CreateProjectModal"
import CreateModuleModal from "./CreateModuleModal"
import CreateTaskModal from "./CreateTaskModal"
import ProjectCard from "./ProjectCard"
import ModuleCard from "./ModuleCard"
import AdminTaskCard from "./AdminTaskCard"
import TaskAssignmentModal from "./TaskAssignmentModal"
import TaskManagementView from "./TaskManagementView"

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

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateModule, setShowCreateModule] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showTaskAssignment, setShowTaskAssignment] = useState(false)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [activeView, setActiveView] = useState<'overview' | 'tasks'>('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [projectsRes, modulesRes, tasksRes, usersRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/modules'),
        fetch('/api/tasks'),
        fetch('/api/users')
      ])

      const [projectsData, modulesData, tasksData, usersData] = await Promise.all([
        projectsRes.json(),
        modulesRes.json(),
        tasksRes.json(),
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

      if (tasksRes.ok && Array.isArray(tasksData)) {
        setTasks(tasksData)
      } else {
        console.error('Error fetching tasks:', tasksData.error || 'Unknown error')
        setTasks([])
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
      setTasks([])
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

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        await fetchData()
        setShowCreateTask(false)
      }
    } catch (error) {
      console.error('Error creating task:', error)
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

  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter(project => project.id !== projectId))
  }

  const handleDeleteModule = (moduleId: number) => {
    setModules(modules.filter(module => module.id !== moduleId))
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId))
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
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Task Management
          </button>
        </nav>
      </div>

      {activeView === 'tasks' ? (
        <TaskManagementView />
      ) : (
        <>
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
        <button
          onClick={() => setShowCreateTask(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Projects Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onDelete={handleDeleteProject}
            />
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
              onDelete={handleDeleteModule}
            />
          ))}
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <AdminTaskCard 
              key={task.id} 
              task={task} 
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
        {tasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found</p>
          </div>
        )}
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

      {showCreateTask && (
        <CreateTaskModal
          projects={projects}
          modules={modules}
          users={users.filter(user => user.role === 'DEVELOPER')}
          onClose={() => setShowCreateTask(false)}
          onSubmit={handleCreateTask}
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
        </>
      )}
    </div>
  )
}
