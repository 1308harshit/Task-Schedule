import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const moduleId = searchParams.get('moduleId')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (projectId) where.projectId = parseInt(projectId)
    if (moduleId) where.moduleId = parseInt(moduleId)
    if (status) where.status = status
    if (userId) {
      if (userId === 'me') {
        // Use the current user's ID from session
        where.assignments = {
          some: {
            userId: parseInt(session.user.id)
          }
        }
      } else {
        where.assignments = {
          some: {
            userId: parseInt(userId)
          }
        }
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true }
        },
        module: {
          select: { id: true, name: true }
        },
        functionality: {
          select: { id: true, name: true, type: true }
        },
        requirement: {
          select: { id: true, title: true }
        },
        frontendResource: {
          select: { id: true, name: true, type: true }
        },
        backendResource: {
          select: { id: true, name: true, type: true }
        },
        apiEndpoint: {
          select: { id: true, name: true, method: true, path: true }
        },
        databaseTable: {
          select: { id: true, name: true }
        },
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        timeLogs: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can create tasks
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      projectId,
      moduleId,
      functionalityId,
      requirementId,
      frontendResourceId,
      backendResourceId,
      apiEndpointId,
      databaseTableId,
      priority,
      estimatedHours,
      dueDate,
      assignedUserIds
    } = body

    if (!title || !projectId) {
      return NextResponse.json({ error: 'Task title and project ID are required' }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        estimatedHours: estimatedHours ? parseInt(estimatedHours) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: parseInt(projectId),
        moduleId: moduleId ? parseInt(moduleId) : null,
        functionalityId: functionalityId ? parseInt(functionalityId) : null,
        requirementId: requirementId ? parseInt(requirementId) : null,
        frontendResourceId: frontendResourceId ? parseInt(frontendResourceId) : null,
        backendResourceId: backendResourceId ? parseInt(backendResourceId) : null,
        apiEndpointId: apiEndpointId ? parseInt(apiEndpointId) : null,
        databaseTableId: databaseTableId ? parseInt(databaseTableId) : null,
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        module: {
          select: { id: true, name: true }
        },
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    })

    // Assign tasks to users if provided
    if (assignedUserIds && assignedUserIds.length > 0) {
      const assignments = assignedUserIds.map((userId: number) => ({
        taskId: task.id,
        userId: parseInt(userId.toString()),
        assignedBy: parseInt(session.user.id),
      }))

      await prisma.taskAssignment.createMany({
        data: assignments
      })

      // Create notifications for assigned users
      const notifications = assignedUserIds.map((userId: number) => ({
        title: 'Task Assigned',
        message: `You have been assigned a new task: ${title}`,
        type: 'TASK_ASSIGNED',
        userId: parseInt(userId.toString()),
        data: { taskId: task.id }
      }))

      await prisma.notification.createMany({
        data: notifications
      })
    }

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
