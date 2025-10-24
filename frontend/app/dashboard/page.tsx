"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { api, PopulatedTask } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle } from "lucide-react"
import { TaskCard } from "@/components/task-card"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<PopulatedTask[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  async function loadTasks() {
    try {
      const data = await api.getUserTasks()
      setTasks(data)
    } catch (error: any) {
      setTasks([])
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
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="mt-1 text-muted-foreground">Manage your tasks and collaborate with your team</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) :
        (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks && tasks.length > 0 ? tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((task) => (
              <TaskCard
                key={task._id}
                task={task}
              />
            )) : 
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 col-span-full">
              <CheckCircle className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No tasks yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">Get started by creating your first task</p>
            </div>
            }
          </div>
        )}
      </main>
    </div>
  )
}