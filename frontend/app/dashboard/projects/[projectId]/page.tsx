"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { api, type PopulatedProject, type PopulatedTask } from "@/lib/api"
import { CreateTaskDialog } from "@/components/create-task-dialog"
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
    setLoading(true); 
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        api.getProject(projectId), 
        api.getAllProjectTasks(projectId)
      ]);
      
      const projectData = projectResponse;
      const tasksData = tasksResponse;
      
      setProject(projectData);
      setTasks(tasksData);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";

      toast({
        title: "Project Load Failed",
        description: errorMessage,
        variant: "destructive",
      });
      router.push("/dashboard"); 

    } finally {
      setLoading(false);
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
      <main className="container py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
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
          />
          <TaskColumn
            title="In Progress"
            tasks={inProgressTasks}
            count={inProgressTasks.length}
            color="bg-blue-500"
          />
          <TaskColumn
            title="Review"
            tasks={reviewTasks}
            count={reviewTasks.length}
            color="bg-yellow-500"
          />
          <TaskColumn
            title="Done"
            tasks={doneTasks}
            count={doneTasks.length}
            color="bg-green-500"

          />        
        </div>
      </main>

      <ManageMembersDialog
        project={project}
        open={showMembersDialog}
        onOpenChange={setShowMembersDialog}
        onMembersUpdated={loadProjectData}
      />
    </div>
  )
}
