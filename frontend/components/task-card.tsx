"use client"

import type { PopulatedTask } from "@/lib/api"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Calendar, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format, isPast, isToday } from "date-fns"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: PopulatedTask
  onEdit: (task: PopulatedTask) => void
  onDelete: (id: string) => void
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const dueDate = new Date(task.dueDate)
  const isOverdue = isPast(dueDate) && !isToday(dueDate) && task.status !== "done"

  return (
    <Card className="group cursor-pointer transition-colors hover:border-accent/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="flex-1 font-medium leading-snug" onClick={() => onEdit(task)}>
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>Edit Task</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task._id)} className="text-destructive">
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && <p className="line-clamp-2 text-sm text-muted-foreground">{task.description}</p>}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
            {task.priority}
          </Badge>

          <div
            className={cn("flex items-center gap-1 text-xs", isOverdue ? "text-destructive" : "text-muted-foreground")}
          >
            {isOverdue && <AlertCircle className="h-3 w-3" />}
            <Calendar className="h-3 w-3" />
            <span>{format(dueDate, "MMM d")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
