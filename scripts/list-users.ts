import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log('📋 Current Users in Database:')
    console.log('================================')
    
    if (users.length === 0) {
      console.log('No users found. Make sure you have run the seed script.')
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'No name'} (${user.email})`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}`)
        console.log('')
      })
    }
  } catch (error) {
    console.error('❌ Error fetching users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
