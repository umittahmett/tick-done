"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bell,
  BookOpen,
  Bot,
  CheckCircle,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
  Zap,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import clsx from "clsx"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Tasks",
      url: "/dashboard",
      icon: CheckCircle ,
      isActive: true,
    },
    {
      title: "My Projects",
      url: "/dashboard/my-projects",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Shared Projects",
      url: "/dashboard/shared-projects",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
      isActive: true,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      isActive: true,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={clsx('p-4 pb-8', state === "collapsed" && "p-2")}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Zap className="h-5 w-5 text-accent-foreground" />
          </div>
          {state === "expanded" && <span className="text-xl font-semibold">TaskFlow</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tick Done</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item,index) => (
              <SidebarMenuItem className={clsx(pathname == item.url && "text-accent bg-sidebar-accent rounded-md")} key={index}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
