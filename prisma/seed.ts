import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskmanager.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@taskmanager.com',
      role: 'ADMIN',
      isActive: true,
    },
  })

  // Create Developer Users
  const developer1 = await prisma.user.upsert({
    where: { email: 'developer1@taskmanager.com' },
    update: {},
    create: {
      name: 'John Developer',
      email: 'developer1@taskmanager.com',
      role: 'DEVELOPER',
      isActive: true,
    },
  })

  const developer2 = await prisma.user.upsert({
    where: { email: 'developer2@taskmanager.com' },
    update: {},
    create: {
      name: 'Jane Developer',
      email: 'developer2@taskmanager.com',
      role: 'DEVELOPER',
      isActive: true,
    },
  })

  // Create Sample Project
  const project = await prisma.project.create({
    data: {
      name: 'E-commerce Platform',
      description: 'A comprehensive e-commerce platform with user management, product catalog, and payment processing',
      status: 'IN_PROGRESS',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      progress: 25,
      creatorId: admin.id,
    },
  })

  // Create Sample Modules
  const userModule = await prisma.module.create({
    data: {
      name: 'User Management',
      description: 'User registration, authentication, and profile management',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      projectId: project.id,
      creatorId: admin.id,
    },
  })

  const productModule = await prisma.module.create({
    data: {
      name: 'Product Catalog',
      description: 'Product listing, search, and categorization',
      status: 'PLANNING',
      priority: 'MEDIUM',
      projectId: project.id,
      creatorId: admin.id,
    },
  })

  // Create Sample Functionalities for User Management Module
  const authFunctionality = await prisma.functionality.create({
    data: {
      name: 'User Authentication',
      description: 'Login, logout, and session management',
      type: 'BACKEND',
      status: 'IN_PROGRESS',
      moduleId: userModule.id,
    },
  })

  const profileFunctionality = await prisma.functionality.create({
    data: {
      name: 'User Profile',
      description: 'User profile management and settings',
      type: 'FRONTEND',
      status: 'PLANNING',
      moduleId: userModule.id,
    },
  })

  const userValidationFunctionality = await prisma.functionality.create({
    data: {
      name: 'User Validation',
      description: 'Form validation and input sanitization',
      type: 'FRONTEND',
      status: 'PLANNING',
      moduleId: userModule.id,
    },
  })

  const userDatabaseFunctionality = await prisma.functionality.create({
    data: {
      name: 'User Database Schema',
      description: 'Database tables and relationships for users',
      type: 'DATABASE',
      status: 'COMPLETED',
      moduleId: userModule.id,
    },
  })

  // Create Sample Functionalities for Product Catalog Module
  const productListingFunctionality = await prisma.functionality.create({
    data: {
      name: 'Product Listing',
      description: 'Display products with pagination and filtering',
      type: 'FRONTEND',
      status: 'PLANNING',
      moduleId: productModule.id,
    },
  })

  const productSearchFunctionality = await prisma.functionality.create({
    data: {
      name: 'Product Search',
      description: 'Search functionality with filters and sorting',
      type: 'BACKEND',
      status: 'PLANNING',
      moduleId: productModule.id,
    },
  })

  const productApiFunctionality = await prisma.functionality.create({
    data: {
      name: 'Product API Endpoints',
      description: 'REST API for product CRUD operations',
      type: 'API',
      status: 'PLANNING',
      moduleId: productModule.id,
    },
  })

  const productDatabaseFunctionality = await prisma.functionality.create({
    data: {
      name: 'Product Database Schema',
      description: 'Database tables for products, categories, and inventory',
      type: 'DATABASE',
      status: 'PLANNING',
      moduleId: productModule.id,
    },
  })

  const productIntegrationFunctionality = await prisma.functionality.create({
    data: {
      name: 'Payment Integration',
      description: 'Integration with payment gateways',
      type: 'INTEGRATION',
      status: 'PLANNING',
      moduleId: productModule.id,
    },
  })

  const productTestingFunctionality = await prisma.functionality.create({
    data: {
      name: 'Product Testing Suite',
      description: 'Unit and integration tests for product features',
      type: 'TESTING',
      status: 'PLANNING',
      moduleId: productModule.id,
    },
  })

  // Create Sample Requirements
  const requirement1 = await prisma.requirement.create({
    data: {
      title: 'Secure User Authentication',
      description: 'Implement secure JWT-based authentication with password hashing',
      status: 'APPROVED',
      priority: 'HIGH',
      projectId: project.id,
      creatorId: admin.id,
    },
  })

  // Create Sample Frontend Resources
  const loginPage = await prisma.frontendResource.create({
    data: {
      name: 'Login Page',
      type: 'PAGE',
      path: '/auth/login',
      description: 'User login page with form validation',
      version: '1.0.0',
      status: 'IN_PROGRESS',
      projectId: project.id,
      creatorId: admin.id,
    },
  })

  // Create Sample Backend Resources
  const authController = await prisma.backendResource.create({
    data: {
      name: 'AuthController',
      type: 'CONTROLLER',
      path: '/controllers/auth.controller.ts',
      description: 'Authentication controller with login/logout endpoints',
      version: '1.0.0',
      status: 'IN_PROGRESS',
      projectId: project.id,
      creatorId: admin.id,
    },
  })

  // Create Sample API Endpoints
  const loginApi = await prisma.apiEndpoint.create({
    data: {
      name: 'User Login',
      path: '/api/auth/login',
      method: 'POST',
      description: 'Authenticate user and return JWT token',
      status: 'IN_PROGRESS',
      projectId: project.id,
      backendResourceId: authController.id,
      creatorId: admin.id,
    },
  })

  // Create Sample Database Tables
  const usersTable = await prisma.databaseTable.create({
    data: {
      name: 'users',
      description: 'User accounts and profile information',
      schema: {
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'email', type: 'VARCHAR(255)', unique: true },
          { name: 'password_hash', type: 'VARCHAR(255)' },
          { name: 'name', type: 'VARCHAR(255)' },
          { name: 'created_at', type: 'TIMESTAMP' },
        ],
      },
      status: 'COMPLETED',
      projectId: project.id,
      creatorId: admin.id,
    },
  })

  // Link API to Database Table
  await prisma.databaseTableRelation.create({
    data: {
      apiEndpointId: loginApi.id,
      databaseTableId: usersTable.id,
      operation: 'READ',
    },
  })

  // Create Sample Tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Implement JWT Authentication',
      description: 'Create JWT token generation and validation middleware',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      estimatedHours: 8,
      startDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      projectId: project.id,
      moduleId: userModule.id,
      functionalityId: authFunctionality.id,
      requirementId: requirement1.id,
      backendResourceId: authController.id,
      apiEndpointId: loginApi.id,
      databaseTableId: usersTable.id,
    },
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Create Login UI',
      description: 'Design and implement the login page with form validation',
      status: 'PENDING',
      priority: 'MEDIUM',
      estimatedHours: 6,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      projectId: project.id,
      moduleId: userModule.id,
      functionalityId: profileFunctionality.id,
      frontendResourceId: loginPage.id,
    },
  })

  // Assign Tasks to Developers
  await prisma.taskAssignment.create({
    data: {
      taskId: task1.id,
      userId: developer1.id,
      assignedBy: admin.id,
    },
  })

  await prisma.taskAssignment.create({
    data: {
      taskId: task2.id,
      userId: developer2.id,
      assignedBy: admin.id,
    },
  })

  // Create Sample Milestones
  await prisma.milestone.create({
    data: {
      name: 'User Authentication Complete',
      description: 'Complete user authentication system with login/logout',
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'PENDING',
      projectId: project.id,
    },
  })

  // Create Sample Notifications
  await prisma.notification.create({
    data: {
      title: 'Task Assigned',
      message: 'You have been assigned a new task: Implement JWT Authentication',
      type: 'TASK_ASSIGNED',
      userId: developer1.id,
      data: { taskId: task1.id },
    },
  })

  await prisma.notification.create({
    data: {
      title: 'Task Assigned',
      message: 'You have been assigned a new task: Create Login UI',
      type: 'TASK_ASSIGNED',
      userId: developer2.id,
      data: { taskId: task2.id },
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created ${3} users (1 admin, 2 developers)`)
  console.log(`📁 Created ${1} project with ${2} modules`)
  console.log(`⚙️ Created ${10} functionalities`)
  console.log(`📋 Created ${1} requirement`)
  console.log(`🎨 Created ${1} frontend resource`)
  console.log(`🔧 Created ${1} backend resource`)
  console.log(`🌐 Created ${1} API endpoint`)
  console.log(`🗄️ Created ${1} database table`)
  console.log(`✅ Created ${2} tasks with assignments`)
  console.log(`🎯 Created ${1} milestone`)
  console.log(`🔔 Created ${2} notifications`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })