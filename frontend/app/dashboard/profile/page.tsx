'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Information</h1>
          <p className="mt-1 text-muted-foreground">View and manage your personal information</p>
        </div>

        <Card >
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Basic information about your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                {user.fullname || 'Not specified'}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Title</p>
              <p className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                {user.title || 'Not specified'}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Email Address</p>
              <p className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                {user.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}