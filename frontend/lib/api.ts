import axiosClient from "./apiClient"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"


export class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message)
  }
}
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

export interface Notification {
  _id: string
  user: string
  type: "projectInvite" | "taskAssignment" | "taskDue" | "generic"
  subject: string
  content: string
  channel: "app" | "email"
  read: boolean
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
    const res = await axiosClient.post(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
    })
    return res.data
  }

  async getMe(): Promise<{ data: User, message: string, success: boolean }> {
    const res = await axiosClient.post(`${API_URL}/auth/me`, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
    })
    
    if (!res.data.success) throw new ApiError(res.data.message || "Failed to get user", res.data.error.status)
    return res.data
  }

  async verifyOtp(email: string, otp: string) {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ email, otp }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to verify OTP")
    return data
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

  async resetPassword(email: string, newPassword: string) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ email, newPassword }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to reset password")
    return data
  }

  // async refreshToken() {
  //   const res = await fetch(`${API_URL}/auth/refresh-token`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: 'include',
  //   })
  //   const data = await res.json()
  //   if (!res.ok) throw new Error(data.message || "Failed to refresh token")
  //   return data
  // }

  // Project endpoints
  async createProject(name: string, description?: string): Promise<Project> {
    const res = await axiosClient.post(`${API_URL}/projects/createProject`, {
      name,
      description,
    })
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to create project")
    return data.data
  }

  async getUserProjects(): Promise<Project[]> {
    const res = await axiosClient.get(`${API_URL}/projects/getUserProjects`)
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to get projects")
    return data.data
  }

  async getProject(projectId: string): Promise<PopulatedProject> {
    const res = await axiosClient.get(`${API_URL}/projects/getProject/${projectId}`)
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to get project")
    return data.data
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const res = await axiosClient.put(`${API_URL}/projects/updateProject/${projectId}`, {
      updates,
    })
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to update project")
    return data.data
  }

  async deleteProject(projectId: string) {
    const res = await axiosClient.delete(`${API_URL}/projects/deleteProject/${projectId}`)
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to delete project")
    return data
  }

  async addMemberToProject(projectId: string, invitee: string, inviter: string) {
    console.log('project id for adding member', projectId);
    
    const res = await axiosClient.post(`${API_URL}/projects/addMemberToProject/${projectId}`, {
      invitee,
      inviter,
    })
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to add member")
    return data
  }

  async handleInvitation(token: string, status: string) {
    const res = await axiosClient.post(`${API_URL}/projects/handleInvitation`, {
      token,
      status,
    })
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to handle invitation")
    return data
  }

  async deleteMemberFromProject(projectId: string, email: string) {
    const res = await axiosClient.post(`${API_URL}/projects/deleteMemberFromProject/${projectId}`, {
      email,
    })
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to remove member")
    return data
  }

  // Task endpoints
  async createTask(projectId: string, task: Partial<Task>): Promise<Task> {
    const res = await axiosClient.post(`${API_URL}/tasks/createTask/${projectId}`, {
      task,
    })
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to create task")
    return data.data
  }

  async getAllProjectTasks(projectId: string): Promise<PopulatedTask[]> {
    const res = await axiosClient.get(`${API_URL}/tasks/getAllProjectTasks/${projectId}`)
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to get tasks")
    return data.data
  }

  async getUserTasks(projectId: string): Promise<Task[]> {
    const res = await axiosClient.get(`${API_URL}/tasks/getUserTasks/${projectId}`)
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to get user tasks")
    return data.data
  }

  async getTask(taskId: string): Promise<Task> {
    const res = await axiosClient.get(`${API_URL}/tasks/getTask/${taskId}`)
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to get task")
    return data.data
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const res = await axiosClient.put(`${API_URL}/tasks/updateTask/${taskId}`, {
      updates,
    })
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to update task")
    return data.data
  }

  async deleteTask(taskId: string) {
    const res = await axiosClient.delete(`${API_URL}/tasks/deleteTask/${taskId}`)
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to delete task")
    return data
  }

  // Notification endpoints
  async getUserNotifications(
    type?: string,
    channel?: "app" | "email",
    limit: number = 10
  ): Promise<Notification[]> {
    const params = new URLSearchParams();
    
    if (type) params.append('type', type);
    if (channel) params.append('channel', channel);
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = `${API_URL}/notifications/getUserNotifications${queryString ? `?${queryString}` : ''}`;
    
    const res = await axiosClient.get(url)
    const data = await res.data
    if (!res.data.success) throw new Error(data.message || "Failed to get notifications")
    return data.data
  }
}

export const api = new ApiClient()
