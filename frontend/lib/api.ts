const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export interface User {
  _id: string
  email: string
  fullname?: string
  title?: string
}

export interface Project {
  _id: string
  name: string
  description: string
  creator: string
  members: string[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  _id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  assignments: string[]
  creator: string
  project: string
  createdAt: string
  updatedAt: string
}

export interface PopulatedProject extends Omit<Project, 'creator' | 'members'> {
  creator: User
  members: User[]
}

export interface PopulatedTask extends Omit<Task, 'creator' | 'assignments'> {
  creator: User
  assignments: User[]
}

class ApiClient {
  // Auth endpoints
  async register(email: string, password: string, fullname?: string, title?: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ email, password, fullname, title }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Registration failed")
    return data
  }

  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Login failed")
    return data
  }

  async logout() {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
    })
    return res.ok
  }

  async getMe(): Promise<User> {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to get user")
    return data.data || data.user
  }

  async forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to send reset email")
    return data
  }

  async resetPassword(token: string, password: string) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to reset password")
    return data
  }

  // Project endpoints
  async createProject(name: string, description?: string): Promise<Project> {
    const res = await fetch(`${API_URL}/projects/createProject`, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to create project")
    return data.data
  }

  async getUserProjects(): Promise<Project[]> {
    const res = await fetch(`${API_URL}/projects/getUserProjects`, {
      method: "GET",
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to get projects")
    return data.data
  }

  async getProject(projectId: string): Promise<PopulatedProject> {
    const res = await fetch(`${API_URL}/projects/getProject/${projectId}`, {
      method: "GET",
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to get project")
    return data.data
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_URL}/projects/updateProject/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(updates),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to update project")
    return data.data
  }

  async deleteProject(projectId: string) {
    const res = await fetch(`${API_URL}/projects/deleteProject/${projectId}`, {
      method: "DELETE",
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to delete project")
    return data
  }

  async addMemberToProject(projectId: string, email: string) {
    console.log('project id for adding member', projectId);
    
    const res = await fetch(`${API_URL}/projects/addMemberToProject/${projectId}`, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to add member")
    return data
  }

  async deleteMemberFromProject(projectId: string, email: string) {
    const res = await fetch(`${API_URL}/projects/deleteMemberFromProject/${projectId}`, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to remove member")
    return data
  }

  // Task endpoints
  async createTask(projectId: string, task: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/createTask/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(task),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to create task")
    return data.data
  }

  async getAllProjectTasks(projectId: string): Promise<PopulatedTask[]> {
    const res = await fetch(`${API_URL}/tasks/getAllProjectTasks/${projectId}`, {
      method: "GET",
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to get tasks")
    return data.data
  }

  async getUserTasks(projectId: string): Promise<Task[]> {
    const res = await fetch(`${API_URL}/tasks/getUserTasks/${projectId}`, {
      method: "GET",
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to get user tasks")
    return data.data
  }

  async getTask(taskId: string): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/getTask/${taskId}`, {
      method: "GET",
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to get task")
    return data.data
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/updateTask/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(updates),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to update task")
    return data.data
  }

  async deleteTask(taskId: string) {

    console.log('received taskId', taskId);
    
    const res = await fetch(`${API_URL}/tasks/deleteTask/${taskId}`, {
      method: "DELETE",
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to delete task")
    return data
  }
}

export const api = new ApiClient()
