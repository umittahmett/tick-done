"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { api, type PopulatedProject, type PopulatedTask } from "@/lib/api"
import { DashboardHeader } from "@/components/dashboard-header"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { TaskColumn } from "@/components/task-column"
import { ManageMembersDialog } from "@/components/manage-members-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

export default function ProjectPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [project, setProject] = useState<PopulatedProject | null>(null)
  const [tasks, setTasks] = useState<PopulatedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState<PopulatedTask | null>(null)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && projectId) {
      loadProjectData()
    }
  }, [user, projectId])

  async function loadProjectData() {
    try {
      const [projectData, tasksData] = await Promise.all([api.getProject(projectId), api.getAllProjectTasks(projectId)])
      console.log('projecte data',projectData );
      
      setProject(projectData)
      setTasks(tasksData)
    } catch (error: any) {
      toast({
        title: "Failed to load project",
        description: error.message,
        variant: "destructive",
      })
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteTask(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      await api.deleteTask(id)
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      })
      loadProjectData()
    } catch (error: any) {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (authLoading || !user || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress")
  const reviewTasks = tasks.filter((t) => t.status === "review")
  const doneTasks = tasks.filter((t) => t.status === "done")

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{project?.name}</h1>
              <p className="mt-1 text-muted-foreground">{project?.description || "No description"}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowMembersDialog(true)}>
                <Users className="h-4 w-4" />
                Team ({(project?.members?.length || 0) + 1})
              </Button>
              <CreateTaskDialog projectMembers={project?.members || []} projectId={projectId} onTaskCreated={loadProjectData} />
            </div>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          <TaskColumn
            title="To Do"
            tasks={todoTasks}
            count={todoTasks.length}
            color="bg-gray-500"
            onEditTask={setEditingTask}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="In Progress"
            tasks={inProgressTasks}
            count={inProgressTasks.length}
            color="bg-blue-500"
            onEditTask={setEditingTask}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="Review"
            tasks={reviewTasks}
            count={reviewTasks.length}
            color="bg-yellow-500"
            onEditTask={setEditingTask}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="Done"
            tasks={doneTasks}
            count={doneTasks.length}
            color="bg-green-500"
            onEditTask={setEditingTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </main>

      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onTaskUpdated={loadProjectData}
        projectMembers={project?.members || []}
      />

      <ManageMembersDialog
        project={project}
        open={showMembersDialog}
        onOpenChange={setShowMembersDialog}
        onMembersUpdated={loadProjectData}
      />
    </div>
  )
}
