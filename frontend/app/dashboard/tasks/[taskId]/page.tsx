"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api, Task, User, type PopulatedTask } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"

export default function ProjectPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Task["status"]>("todo")
  const [priority, setPriority] = useState<Task["priority"]>("medium")
  const [assignments, setAssignments] = useState<string[]>([])
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const taskId = params.taskId as string
  const [task, setTask] = useState<PopulatedTask | null>(null)
  const [projectMembers, setProjectMembers] = useState<User[]>([])
  const [isCreator, setIsCreator] = useState(false)
  const { user } = useAuth()

  async function loadTaskData() {
    setLoading(true); 
    try {
      const taskData = await api.getTask(taskId);
      const projectData = await api.getProject(taskData.project._id);
      
      setTask(taskData);
      setTitle(taskData.title)
      setDescription(taskData.description || "")
      setStatus(taskData.status)
      setPriority(taskData.priority)
      setDueDate(taskData.dueDate.split("T")[0])
      setAssignments(taskData.assignments.map((user) => user._id))
      setProjectMembers(projectData.members);
      setIsCreator(taskData.creator._id == user?._id);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";

      toast({
        title: "Task Load Failed",
        description: errorMessage,
        variant: "destructive",
      });
      router.push("/dashboard"); 

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (taskId) {
      loadTaskData()
    }
  }, [taskId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!task) return

    setIsSubmitting(true)

    try {
      await api.updateTask(task._id, {
        title,
        description,
        status,
        priority,
        dueDate,
        assignments: assignments,
      })
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteTask() {

    setIsSubmitting(true)
    try {
      await api.deleteTask(taskId)
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      })
      window.history.back()
    } catch (error: any) {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !task) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4 gap-2" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">{task?.title}</h1>
              <p className="mt-1 text-muted-foreground">{task?.description || "No description"}</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 ">
              <div className="flex flex-col gap-1">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Design homepage mockup"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe the task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex w-full items-center gap-6">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as Task["status"])}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select value={priority} onValueChange={(value) => setPriority(value as Task["priority"])}>
                    <SelectTrigger id="edit-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="assignments">Assignments</Label>
                <MultiSelect
                  options={projectMembers?.map((member) => ({
                    label: member.fullname || member.email,
                    value: member._id,
                  }))}
                  value={assignments}
                  onValueChange={setAssignments}
                  placeholder="Select members to assign..."
                  maxCount={2}
                />
              </div>

              <div className="flex justify-end gap-3">
                {
                  isCreator && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button disabled={isSubmitting} variant="destructive">
                          {isSubmitting ? "Deleting..." : "Delete"}
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Task</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this task?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button disabled={isSubmitting} onClick={handleDeleteTask}>
                            {isSubmitting ? "Deleting..." : "Delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )
                }
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
