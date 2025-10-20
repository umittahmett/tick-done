"use client"

import type { Project } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, Users, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
  onEdit: (project: Project) => void
}

export function ProjectCard({ project, onDelete, onEdit }: ProjectCardProps) {
  const router = useRouter()
  return (
    <Card onClick={() => router.push(`/dashboard/projects/${project._id}`)} className="cursor-pointer group transition-colors hover:border-accent/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="duration-200 group-hover:text-accent">{project.name}</CardTitle>
            <CardDescription className="mt-1.5">{project.description || "No description"}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(project)}>Edit Project</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(project._id)} className="!text-destructive">
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{project.members?.length + 1} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
