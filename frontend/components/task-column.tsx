"use client"

import type { PopulatedTask } from "@/lib/api"
import { TaskCard } from "./task-card"
import { cn } from "@/lib/utils"

interface TaskColumnProps {
  title: string
  tasks: PopulatedTask[]
  count: number
  color: string
}

export function TaskColumn({ title, tasks, count, color }: TaskColumnProps) {
  return (
    <div className="flex min-w-[320px] flex-col">
      <div className="mb-4 flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{count}</span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  )
}
