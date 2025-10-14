"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api, PopulatedProject, User, type Project } from "@/lib/api"
import { Users, X, Mail } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

interface ManageMembersDialogProps {
  project: PopulatedProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMembersUpdated: () => void
}

export function ManageMembersDialog({ project, open, onOpenChange, onMembersUpdated }: ManageMembersDialogProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    if (!project) return

    setLoading(true)

    try {
      await api.addMemberToProject(project._id, email)
      toast({
        title: "Member added",
        description: `${email} has been added to the project.`,
      })
      setEmail("")
      onMembersUpdated()
    } catch (error: any) {
      toast({
        title: "Failed to add member",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleRemoveMember(email: string) {
    if (!project) return
    if (!confirm("Are you sure you want to remove this member?")) return

    try {
      await api.deleteMemberFromProject(project._id, email)
      toast({
        title: "Member removed",
        description: "The member has been removed from the project.",
      })
      onMembersUpdated()
    } catch (error: any) {
      toast({
        title: "Failed to remove member",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const isCreator = project?.creator._id === user?._id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Team Members
          </DialogTitle>
          <DialogDescription>Add or remove team members from this project.</DialogDescription>
        </DialogHeader>

        {isCreator && (
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-email">Add Member by Email</Label>
              <div className="flex gap-2">
                <Input
                  id="member-email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Team Members ({(project?.members?.length || 0) + 1})</h4>

          <div className="space-y-2">
            {/* Creator */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.fullname || user?.email}</p>
                  <p className="text-xs text-muted-foreground">Creator</p>
                </div>
              </div>
            </div>

            {/* Members */}
            {project?.members?.map((member: User) => (
              <div
                key={member._id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      <Mail className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.fullname}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                {isCreator && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveMember(member.email)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
