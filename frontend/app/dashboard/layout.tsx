import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { ThemeProvider } from "next-themes"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { NotificationsPopup } from "@/components/notifications-popup"
import ThemeSelector from "@/components/ui/theme-switcher"

export const metadata: Metadata = {
  title: "TaskFlow - Project Management",
  description: "Modern task management and team collaboration platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
              <AuthProvider>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                      <div className="flex items-center gap-2 px-4 justify-between container">
                        <div className="flex items-center gap-2">
                          <SidebarTrigger className="-ml-1" />
                          <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                          />
                          <Breadcrumb>
                            <BreadcrumbList>
                              <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                  Building Your Application
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator className="hidden md:block" />
                              <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                              </BreadcrumbItem>
                            </BreadcrumbList>
                          </Breadcrumb>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThemeSelector/>
                          <NotificationsPopup/>
                        </div>
                      </div>
                    </header>
                    <Suspense fallback={null}>
                      {children}
                    </Suspense>
                  </SidebarInset>
                  <Toaster />
                </SidebarProvider>
              </AuthProvider>
          </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}