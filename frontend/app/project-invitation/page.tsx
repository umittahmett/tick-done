"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { api } from "@/lib/api"
import { useState } from "react"
import { Card, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

const ProjectInvitationPage = () => {
  const [loading, setLoading] = useState(true)
  const token = useSearchParams().get('token')
  const status = useSearchParams().get('status')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token || !status) {
      return
    }

    api.handleInvitation(token, status).then((data) => {
      setMessage(data.message)
      setSuccess(true)
    }).catch((error) => {
      setMessage(error.message)
      setSuccess(false)
    }).finally(() => {
      setLoading(false)
    })
  }, [token, status])
  
  return (
    loading ? (
      <div className="flex items-center justify-center py-12 -translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    ) : (
      <Card className="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 p-6 text-center">
        {success ? <CheckCircle className="size-12 text-green-500 mx-auto"/> : <XCircle className="size-12 text-red-500 mx-auto"/>}
        <CardTitle className="text-2xl font-semibold">{success ? 'Invitation processed successfully' : 'Invitation processed failed'}</CardTitle>
        <p className="text-sm text-muted-foreground">{success ? 'You have been added to the project.' : message || 'Something went wrong'}</p>

        <Link href="/dashboard">Go to dashboard</Link>
      </Card>
    )
  )
}

export default ProjectInvitationPage