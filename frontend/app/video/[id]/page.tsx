"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { ArrowLeft, ThumbsUp, MessageCircle, Eye, Calendar, User, Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useVideoStore } from "@/lib/stores/video-store"

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
      <div className="text-muted-foreground">Loading player...</div>
    </div>
  ),
})

export default function VideoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.id as string
  const [showFullDescription, setShowFullDescription] = useState(false)

  const { currentVideo: video, isLoading, error, fetchVideo, clearVideo } = useVideoStore()

  useEffect(() => {
    if (videoId) {
      fetchVideo(videoId)
    }

    // Cleanup when component unmounts
    return () => {
      clearVideo()
    }
  }, [videoId, fetchVideo, clearVideo])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDescription = (description: string) => {
    const lines = description.split("\n")
    if (!showFullDescription && lines.length > 5) {
      return lines.slice(0, 5).join("\n") + "..."
    }
    return description
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24)
      return `${days} day${days !== 1 ? "s" : ""} ago`
    } else if (diffInHours < 720) {
      const weeks = Math.floor(diffInHours / 168)
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`
    } else {
      const months = Math.floor(diffInHours / 720)
      return `${months} month${months !== 1 ? "s" : ""} ago`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-6"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="w-full aspect-video bg-muted rounded-lg mb-4"></div>
                <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-16 bg-muted rounded mb-4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">
              {error === "Video not found" ? "Video not found" : "Error loading video"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {error === "Video not found"
                ? "The video you're looking for doesn't exist or has been removed."
                : "There was an error loading the video. Please try again."}
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
              {error !== "Video not found" && <Button onClick={() => fetchVideo(videoId)}>Try Again</Button>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${video.videoId}`}
                width="100%"
                height="100%"
                controls
                playing={false}
                config={{
                  youtube: {
                    playerVars: {
                      showinfo: 1,
                      modestbranding: 1,
                    },
                  },
                }}
              />
            </div>

            {/* Video Title and Meta */}
            <div>
              <h1 className="text-2xl font-bold mb-3">{video.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {formatNumber(video.viewCount)} views
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {getRelativeTime(video.publishedAt)}
                </div>
              </div>

              {/* Engagement Actions */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                  <ThumbsUp className="h-5 w-5" />
                  <span className="font-medium">{formatNumber(video.likeCount)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">{formatNumber(video.commentCount)}</span>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>

            <Separator />

            {/* Channel Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Content Creator</h3>
                <p className="text-sm text-muted-foreground">Educational Channel</p>
              </div>
              <Button variant="outline" size="sm">
                Subscribe
              </Button>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {formatDescription(video.description)}
                </div>
                {video.description.split("\n").length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 p-0 h-auto"
                  >
                    {showFullDescription ? "Show less" : "Show more"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Video Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Video Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{video.viewCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Likes</span>
                  <span className="font-medium">{video.likeCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comments</span>
                  <span className="font-medium">{video.commentCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{formatDate(video.publishedAt)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Like Ratio</span>
                  <span className="font-medium">
                    {((video.likeCount / (video.likeCount + video.commentCount)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engagement</span>
                  <span className="font-medium">
                    {(((video.likeCount + video.commentCount) / video.viewCount) * 100).toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Video Info */}
            <Card>
              <CardHeader>
                <CardTitle>Video Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Video ID</p>
                  <p className="text-sm text-muted-foreground font-mono">{video.videoId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Upload Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(video.publishedAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <Badge variant="secondary">Education</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Related Videos Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Related Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Related videos will appear here when integrated with the API.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
