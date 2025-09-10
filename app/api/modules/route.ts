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

    const where = projectId ? { projectId: parseInt(projectId) } : {}

    const modules = await prisma.module.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        },
        functionalities: true,
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(modules)
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can create modules
    if ((session.user as any).role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, projectId, priority, functionalities } = body

    if (!name || !projectId) {
      return NextResponse.json({ error: 'Module name and project ID are required' }, { status: 400 })
    }

    // Create module with functionalities in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the module
      const module = await tx.module.create({
        data: {
          name,
          description,
          priority: priority || 'MEDIUM',
          projectId: parseInt(projectId),
          creatorId: parseInt(session.user.id!),
        },
        include: {
          project: {
            select: { id: true, name: true }
          },
          creator: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      // Create functionalities if provided
      if (functionalities && Array.isArray(functionalities) && functionalities.length > 0) {
        const functionalityData = functionalities.map((func: any) => ({
          name: func.name,
          description: func.description,
          type: func.type,
          status: func.status,
          moduleId: module.id
        }))

        await tx.functionality.createMany({
          data: functionalityData
        })
      }

      return module
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete modules
    if ((session.user as any).role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('id')

    if (!moduleId) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 })
    }

    // Delete the module (cascade will handle related records)
    await prisma.module.delete({
      where: { id: parseInt(moduleId) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}