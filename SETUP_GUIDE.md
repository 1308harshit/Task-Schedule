# 🚀 Task Management System - Setup & Run Guide

## 📋 Overview

This is a comprehensive **Unified Project Management & Tracking System** built with Next.js, Prisma, PostgreSQL, and NextAuth.js. The system supports role-based access control with Admin and Developer roles, complete project lifecycle management, and real-time task tracking.

## 🏗️ System Architecture

### Core Features
- **Role-based Access Control**: Admin and Developer roles with different permissions
- **Project Management**: Create and manage projects with modules and functionalities
- **Task Assignment**: Assign tasks to developers with time tracking
- **Resource Management**: Track frontend, backend, API, and database resources
- **Time Tracking**: Built-in time logging and tracking system
- **Notifications**: Real-time notifications for task updates
- **Progress Tracking**: Visual progress indicators and status management

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Prisma Postgres)
- **Authentication**: NextAuth.js with GitHub OAuth
- **UI Components**: Custom components with Heroicons

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- GitHub account
- Prisma account (free)

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Database connection (from Prisma Console)
DATABASE_URL="postgresql://username:password@host:port/database?schema=public&pgbouncer=true&connect_timeout=15"

# NextAuth.js secret (generate with: npx auth secret --copy)
AUTH_SECRET="your-generated-secret-here"

# GitHub OAuth (from GitHub Developer Settings)
AUTH_GITHUB_ID="your-github-client-id-here"
AUTH_GITHUB_SECRET="your-github-client-secret-here"
```

### 2. Database Setup

#### 2.1 Create Prisma Postgres Database
1. Go to [Prisma Console](https://console.prisma.io)
2. Sign up/Login (free)
3. Create new project → Choose "Prisma Postgres"
4. Copy the connection string to your `.env` file

#### 2.2 GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth app:
   - **Application name**: `Task Management System`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID and Client Secret to your `.env` file

#### 2.3 Generate Auth Secret
```bash
npx auth secret --copy
```
Paste the generated secret into your `.env` file.

### 3. Installation & Database Migration

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎯 How to Use the System

### Initial Setup
1. **Sign in with GitHub** - First user will be assigned DEVELOPER role by default
2. **Admin Access** - To get admin access, you need to manually update a user's role in the database:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

### Admin Workflow
1. **Create Projects** - Click "Create Project" to start a new project
2. **Create Modules** - Add modules to organize project components
3. **Assign Tasks** - Create tasks and assign them to developers
4. **Monitor Progress** - View project progress and task completion
5. **Manage Team** - View all developers and their assignments

### Developer Workflow
1. **View Assigned Tasks** - See all tasks assigned to you
2. **Start Tasks** - Begin working on tasks and track time
3. **Update Status** - Mark tasks as in progress, completed, or delayed
4. **Time Tracking** - Log time spent on tasks with descriptions
5. **View Progress** - Monitor your task completion and time spent

## 📊 Database Schema Overview

### Core Models
- **User**: Admin/Developer users with role-based access
- **Project**: Main project containers
- **Module**: Project components (e.g., User Management, Product Catalog)
- **Functionality**: Module features (Frontend, Backend, API, Database)
- **Task**: Individual work items with assignments and time tracking
- **TaskAssignment**: Links tasks to developers
- **TaskTimeLog**: Time tracking records
- **Notification**: System notifications
- **Comment**: Discussion threads on various entities

### Resource Management
- **FrontendResource**: Pages, components, layouts, styles
- **BackendResource**: Controllers, services, models, middleware
- **ApiEndpoint**: API endpoints with HTTP methods
- **DatabaseTable**: Database schema management
- **Requirement**: Project requirements and specifications

## 🔧 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project (Admin only)

### Modules
- `GET /api/modules` - List modules (with optional project filter)
- `POST /api/modules` - Create new module (Admin only)

### Tasks
- `GET /api/tasks` - List tasks (with filters for project, module, user, status)
- `POST /api/tasks` - Create and assign task (Admin only)
- `GET /api/tasks/[id]` - Get task details
- `PATCH /api/tasks/[id]` - Update task status
- `DELETE /api/tasks/[id]` - Delete task (Admin only)

### Time Tracking
- `POST /api/tasks/[id]/time-logs` - Log time for a task

### Users
- `GET /api/users` - List all users (Admin only)
- `PATCH /api/users` - Update user role (Admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications` - Mark notifications as read

## 🎨 UI Components

### Admin Components
- `AdminDashboard` - Main admin interface
- `ProjectCard` - Project display with progress
- `ModuleCard` - Module management with functionalities
- `CreateProjectModal` - Project creation form
- `CreateModuleModal` - Module creation form
- `TaskAssignmentModal` - Task assignment interface

### Developer Components
- `DeveloperDashboard` - Main developer interface
- `TaskCard` - Task display with status controls
- `TimeTrackingModal` - Time logging interface

## 🔐 Security Features

- **Role-based Access Control**: Admin and Developer permissions
- **Session Management**: Secure session handling with NextAuth.js
- **Data Validation**: Input validation on all forms
- **CSRF Protection**: Built-in NextAuth.js CSRF protection
- **SQL Injection Prevention**: Prisma ORM protection

## 📱 Responsive Design

- **Mobile-first**: Optimized for all screen sizes
- **Tailwind CSS**: Utility-first styling
- **Modern UI**: Clean, professional interface
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Railway**: Easy PostgreSQL hosting
- **Supabase**: Alternative database option
- **Docker**: Containerized deployment

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check Prisma Postgres instance is active
   - Run `npx prisma generate`

2. **GitHub OAuth Error**
   - Verify callback URL matches exactly
   - Check Client ID and Secret are correct
   - Ensure GitHub app is not suspended

3. **Permission Errors**
   - Check user role in database
   - Verify session is active
   - Clear browser cookies and re-login

4. **Build Errors**
   - Run `npm install` to ensure dependencies are installed
   - Check TypeScript errors with `npm run build`
   - Verify all environment variables are set

### Useful Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (careful - deletes all data!)
npx prisma migrate reset

# Check database status
npx prisma db status

# Generate new migration
npx prisma migrate dev --name your-migration-name

# Deploy migrations to production
npx prisma migrate deploy
```

## 📈 Future Enhancements

- **Real-time Updates**: WebSocket integration for live updates
- **File Attachments**: Task file uploads and management
- **Advanced Analytics**: Project velocity and burn-down charts
- **Integration APIs**: GitHub, Slack, Jira integrations
- **Mobile App**: React Native mobile application
- **Advanced Permissions**: Granular role and permission system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**🎉 Congratulations!** You now have a fully functional task management system. The system includes everything from project creation to time tracking, with a modern UI and robust backend architecture.

For support or questions, please refer to the troubleshooting section or create an issue in the repository.
