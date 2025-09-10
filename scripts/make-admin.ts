import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeUserAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    
    console.log(`✅ Successfully updated ${user.name || user.email} to ADMIN role`)
  } catch (error) {
    console.error('❌ Error updating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Replace with your actual email
const userEmail = 'your-email@example.com' // 👈 CHANGE THIS TO YOUR EMAIL

makeUserAdmin(userEmail)
