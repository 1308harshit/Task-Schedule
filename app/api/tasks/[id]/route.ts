import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { UserRole, TaskStatus } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
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
          },
          orderBy: { startTime: 'desc' }
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Check if user has permission to update this task
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        assignments: {
          select: { userId: true }
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const isAssignedUser = task.assignments.some(assignment => assignment.userId === parseInt(session.user.id))
    const isAdmin = session.user.role === UserRole.ADMIN

    if (!isAssignedUser && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (body.title) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.priority) updateData.priority = body.priority
    if (body.estimatedHours !== undefined) updateData.estimatedHours = body.estimatedHours
    if (body.dueDate) updateData.dueDate = new Date(body.dueDate)
    
    // Handle status changes
    if (body.status) {
      updateData.status = body.status
      
      // Set completion date if task is completed
      if (body.status === TaskStatus.COMPLETED) {
        updateData.completedAt = new Date()
      } else if (body.status !== TaskStatus.COMPLETED && task.status === TaskStatus.COMPLETED) {
        updateData.completedAt = null
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: updateData,
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

    // Create notification if task is completed
    if (body.status === TaskStatus.COMPLETED) {
      // Notify admins about task completion
      const admins = await prisma.user.findMany({
        where: { role: UserRole.ADMIN },
        select: { id: true }
      })

      const notifications = admins.map(admin => ({
        title: 'Task Completed',
        message: `Task "${updatedTask.title}" has been completed`,
        type: 'TASK_COMPLETED',
        userId: admin.id,
        data: { taskId: updatedTask.id }
      }))

      await prisma.notification.createMany({
        data: notifications
      })
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete tasks
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    await prisma.task.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
