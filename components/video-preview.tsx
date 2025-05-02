"use client"

import { useEffect, useRef, memo } from "react"

interface VideoPreviewProps {
  file: File
  className?: string
}

// Using memo to prevent unnecessary re-renders
const VideoPreview = memo(function VideoPreview({ file, className }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoUrlRef = useRef<string | null>(null)

  useEffect(() => {
    // Create object URL only once per file
    if (!videoUrlRef.current) {
      videoUrlRef.current = URL.createObjectURL(file)
    }

    // Set the video source
    if (videoRef.current) {
      videoRef.current.src = videoUrlRef.current
    }

    // Clean up the object URL when component unmounts
    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current)
        videoUrlRef.current = null
      }
    }
  }, [file])

  return <video ref={videoRef} controls className={className || "max-h-[300px] w-auto rounded-lg"} />
})

export default VideoPreview
