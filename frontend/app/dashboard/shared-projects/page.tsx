"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { api, type Project } from "@/lib/api"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { ProjectCard } from "@/components/project-card"
import { useToast } from "@/hooks/use-toast"
import { Folder } from "lucide-react"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
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
      const data = await api.getSharedProjects()
      setProjects(data)
    } catch (error: any) {
      setProjects([])
      toast({
        title: "Failed to load projects",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex h-[calc(100dvh-64px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100dvh-64px)] bg-background">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shared Projects</h1>
            <p className="mt-1 text-muted-foreground">Manage your projects and collaborate with your team</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
            <Folder className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No shared projects yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">Get started by creating your first project</p>
            <CreateProjectDialog onProjectCreated={loadProjects} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                isCreator={false}
                key={project._id}
                project={project}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
