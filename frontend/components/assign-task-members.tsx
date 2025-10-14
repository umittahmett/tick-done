"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Member {
  id: string
  name: string
  email: string
}

interface AssignTaskMembersProps {
  members: Member[]
  assignedIds: string[]
  onAssign: (memberIds: string[]) => void
}

export function AssignTaskMembers({ members, assignedIds, onAssign }: AssignTaskMembersProps) {
  const [selected, setSelected] = useState<string[]>(assignedIds)

  function toggleMember(memberId: string) {
    const newSelected = selected.includes(memberId) ? selected.filter((id) => id !== memberId) : [...selected, memberId]

    setSelected(newSelected)
    onAssign(newSelected)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <UserPlus className="h-4 w-4" />
          Assign ({selected.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          <p className="px-2 py-1.5 text-sm font-medium">Assign to team members</p>
          {members.length === 0 ? (
            <p className="px-2 py-2 text-sm text-muted-foreground">No team members</p>
          ) : (
            members.map((member) => (
              <button
                key={member.id}
                onClick={() => toggleMember(member.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent",
                  selected.includes(member.id) && "bg-accent",
                )}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-muted text-xs">
                    {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium">{member.name || member.email}</p>
                </div>
                {selected.includes(member.id) && <Check className="h-4 w-4 text-accent-foreground" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
