"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { healthCheckAPI } from "@/lib/api"

export function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkApiStatus = async () => {
    try {
      await healthCheckAPI()
      setStatus("online")
      setLastCheck(new Date())
    } catch (error) {
      setStatus("offline")
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    checkApiStatus()

    // Check API status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  if (status === "checking") {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>Checking API connection...</AlertDescription>
      </Alert>
    )
  }

  if (status === "offline") {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          API server is offline. Please ensure the backend is running on localhost:3001
          {lastCheck && <span className="block text-xs mt-1">Last checked: {lastCheck.toLocaleTimeString()}</span>}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        API server is online
        {lastCheck && <span className="block text-xs mt-1">Last checked: {lastCheck.toLocaleTimeString()}</span>}
      </AlertDescription>
    </Alert>
  )
}
