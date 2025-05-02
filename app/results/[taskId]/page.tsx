"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Clock, RefreshCw, ExternalLink } from "lucide-react"
import { useTranslation } from "@/lib/use-translation"

// Update the interface to match the backend response format
interface PageResponse {
  status: string
  content_type?: string
  page_names: string
  page_url: string
  msg?: string
}

interface PostContentResponse {
  page_responses?: PageResponse[]
  status?: string // For simple responses
  msg?: string // For simple responses
}

export default function ResultPage() {
  const { taskId } = useParams()
  const [result, setResult] = useState<PostContentResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true)
        // Fetch results from our API route that proxies to the backend
        const response = await fetch(`/api/results/${taskId}`)

        // Handle different response statuses
        if (response.status === 404) {
          setError(t("Task not found"))
          setLoading(false)
          return
        }

        const data = await response.json()

        // If status is in_progress, keep loading state true
        if (response.status === 202 && data.status === "in_progress") {
          setResult(data)
          setError(null)
          setLoading(true) // Keep loading state true for in_progress
        } else {
          setResult(data)
          setError(null)
          setLoading(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch results")
        setLoading(false)
      }
    }

    fetchResult()
    // Poll for results every 5 seconds
    const interval = setInterval(fetchResult, 18000)

    return () => clearInterval(interval)
  }, [taskId, t])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "retry":
        return <RefreshCw className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading && (!result || result.status === "in_progress")) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>{result?.msg || t("Loading results...")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-center text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>{t("Try Again")}</Button>
      </div>
    )
  }

  // Handle simple response format (feed, story/photo, video)
  if (result && !result.page_responses && result.status) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold">{t("Task Results")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>
              {t("Task ID")}: {taskId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <h3 className="font-medium">
                    {t("Status")}: {result.status}
                  </h3>
                </div>
              </div>
              {result.msg && <p className="mt-2 text-sm">{result.msg}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">{t("Task Results")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>
            {t("Task ID")}: {taskId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result?.page_responses?.length ? (
            <div className="space-y-4">
              {result.page_responses.map((response, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(response.status)}
                      <h3 className="font-medium">{response.page_names}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {response.status} {response.content_type && `(${response.content_type})`}
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{response.msg}</p>
                  {response.page_url && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(response.page_url, "_blank")}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t("View on Facebook")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              {t("No results available yet. Please check back later.")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
