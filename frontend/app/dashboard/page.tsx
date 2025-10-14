"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { api, type Project } from "@/lib/api"
import { DashboardHeader } from "@/components/dashboard-header"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { EditProjectDialog } from "@/components/edit-project-dialog"
import { ProjectCard } from "@/components/project-card"
import { useToast } from "@/hooks/use-toast"
import { Folder } from "lucide-react"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  async function loadProjects() {
    try {
      const data = await api.getUserProjects()
      setProjects(data)
    } catch (error: any) {
      toast({
        title: "Failed to load projects",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await api.deleteProject(id)
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      })
      loadProjects()
    } catch (error: any) {
      toast({
        title: "Failed to delete project",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="mt-1 text-muted-foreground">Manage your projects and collaborate with your team</p>
          </div>
          <CreateProjectDialog onProjectCreated={loadProjects} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
            <Folder className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">Get started by creating your first project</p>
            <CreateProjectDialog onProjectCreated={loadProjects} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDeleteProject}
                onEdit={setEditingProject}
              />
            ))}
          </div>
        )}
      </main>

      <EditProjectDialog
        project={editingProject}
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
        onProjectUpdated={loadProjects}
      />
    </div>
  )
}
