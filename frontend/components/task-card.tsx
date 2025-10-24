"use client"

import type { PopulatedTask } from "@/lib/api"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertCircle, Clock } from "lucide-react"
import { format, isPast, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface TaskCardProps {
  task: PopulatedTask
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function TaskCard({ task }: TaskCardProps) {
  const dueDate = new Date(task.dueDate)
  const isOverdue = isPast(dueDate) && !isToday(dueDate) && task.status !== "done"

  return (
    <Link href={`/dashboard/tasks/${task._id}`}>
      <Card className="group !gap-1 cursor-pointer transition-colors hover:border-accent/50">
        <CardHeader>
          <div className="text-xs text-muted-foreground line-clamp-1">{task.project.name}</div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="flex-1 font-medium leading-snug">
              {task.title}
            </h4>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {task.description && <p className="line-clamp-2 text-sm text-muted-foreground">{task.description}</p>}

          <div className="flex flex-col items-start gap-4 border-t border-t-border pt-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Priority:</span>
              <Badge variant="outline" className={cn("ml-1", priorityColors[task.priority])}>
                {task.priority}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">Created:</span>
                <div className="flex items-center gap-1 text-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(task.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
              
              <div className="h-4 w-px bg-foreground/50" />

              <div className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">Due:</span>
                <div className={cn("flex items-center gap-1", isOverdue ? "text-destructive" : "text-foreground")}>
                  {isOverdue && <AlertCircle className="h-3 w-3" />}
                  <Calendar className="h-3 w-3" />
                  <span>{format(dueDate, "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
