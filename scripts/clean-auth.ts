import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanAuthTables() {
  try {
    console.log('🧹 Cleaning auth tables...')
    
    // Delete in correct order (respecting foreign key constraints)
    await prisma.session.deleteMany()
    console.log('✅ Deleted all sessions')
    
    await prisma.account.deleteMany()
    console.log('✅ Deleted all accounts')
    
    // Delete only the problematic user (your GitHub user)
    const deletedUser = await prisma.user.deleteMany({
      where: {
        email: 'khatsuriyaharshit@gmail.com'
      }
    })
    console.log(`✅ Deleted ${deletedUser.count} user(s) with your email`)
    
    console.log('🎉 Auth tables cleaned successfully!')
    console.log('Now try signing in again.')
    
  } catch (error) {
    console.error('❌ Error cleaning auth tables:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanAuthTables()
