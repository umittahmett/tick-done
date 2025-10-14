# TaskFlow - Task Management Frontend

A modern task management application frontend built with Next.js 15, designed to work with a separate Express.js backend.

## Features

- **Authentication System**: Secure user registration, login, and password reset
- **Project Management**: Create, edit, and delete projects with team collaboration
- **Task Board**: Kanban-style board with status columns (Todo, In Progress, Review, Done)
- **Team Collaboration**: Add team members to projects and assign tasks
- **Task Management**: Create tasks with status, priority, due dates, and assignments
- **Modern UI**: Dark theme with professional design using Tailwind CSS and shadcn/ui

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- date-fns for date formatting
- SWR for data fetching

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Running Express.js backend (separate repository)

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

Replace `http://localhost:5000` with your backend URL.

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:4000](http://localhost:4000) in your browser

## Backend API Requirements

This frontend expects the following API endpoints from your Express backend:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Projects
- `POST /api/project/createProject` - Create new project
- `GET /api/project/getUserProjects` - Get user's projects
- `GET /api/project/getProject/:projectId` - Get project details
- `PUT /api/project/updateProject/:projectId` - Update project
- `DELETE /api/project/deleteProject/:projectId` - Delete project
- `POST /api/project/addMemberToProject/:projectId` - Add team member
- `POST /api/project/deleteMemberFromProject/:projectId` - Remove team member

### Tasks
- `POST /api/task/createTask/:projectId` - Create new task
- `GET /api/task/getAllProjectTasks/:projectId` - Get all project tasks
- `GET /api/task/getUserTasks/:projectId` - Get user's tasks
- `GET /api/task/getTask/:taskId` - Get task details
- `PUT /api/task/updateTask/:taskId` - Update task
- `DELETE /api/task/deleteTask/:taskId` - Delete task

## Project Structure

\`\`\`
├── app/
│   ├── dashboard/          # Dashboard page
│   ├── projects/[id]/      # Project detail page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── forgot-password/    # Password reset page
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard-header.tsx
│   ├── project-card.tsx
│   ├── task-card.tsx
│   ├── task-column.tsx
│   └── ...dialogs
└── lib/
    ├── api.ts              # API client
    ├── auth-context.tsx    # Authentication context
    └── utils.ts            # Utility functions
\`\`\`

## Configuration

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable in the Vars section of the v0 sidebar or in your `.env.local` file to point to your running backend server.

## License

MIT
