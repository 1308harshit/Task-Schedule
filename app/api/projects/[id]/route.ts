import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = parseInt(params.id)

    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        modules: {
          include: {
            functionalities: {
              select: {
                id: true,
                name: true,
                description: true,
                type: true,
                status: true
              }
            },
            _count: {
              select: { tasks: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { 
            tasks: true,
            requirements: true,
            frontendResources: true,
            backendResources: true,
            apiEndpoints: true,
            databaseTables: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
