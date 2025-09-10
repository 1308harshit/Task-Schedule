import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function POST(
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
    const { startTime, endTime, description } = body

    // Check if user is assigned to this task
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
    if (!isAssignedUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Calculate duration in minutes
    const start = new Date(startTime)
    const end = new Date(endTime)
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60))

    // Create time log
    const timeLog = await prisma.taskTimeLog.create({
      data: {
        startTime: start,
        endTime: end,
        duration,
        description,
        taskId: parseInt(id),
        userId: parseInt(session.user.id),
      }
    })

    // Update task's actual hours
    const totalActualHours = await prisma.taskTimeLog.aggregate({
      where: { taskId: parseInt(id) },
      _sum: { duration: true }
    })

    await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        actualHours: Math.round((totalActualHours._sum.duration || 0) / 60)
      }
    })

    return NextResponse.json(timeLog, { status: 201 })
  } catch (error) {
    console.error('Error creating time log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
