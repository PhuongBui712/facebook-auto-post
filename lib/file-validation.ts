// Utility functions for file validation

// File size constants (in bytes)
export const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024 // 2GB

// Duration constants (in seconds)
export const MIN_VIDEO_DURATION = 3
export const MAX_STORY_VIDEO_DURATION = 60
export const MAX_REEL_VIDEO_DURATION = 90

// Accepted file types
export const ACCEPTED_IMAGE_TYPES = {
  "image/png": true,
  "image/jpeg": true,
  "image/jpg": true,
  "image/webp": true,
}

export const ACCEPTED_VIDEO_TYPES = {
  "video/mp4": true,
}

// Check if file is an accepted image type
export function isValidImageType(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES[file.type as keyof typeof ACCEPTED_IMAGE_TYPES] || false
}

// Check if file is an accepted video type
export function isValidVideoType(file: File): boolean {
  return ACCEPTED_VIDEO_TYPES[file.type as keyof typeof ACCEPTED_VIDEO_TYPES] || false
}

// Check if video file size is within limits
export function isValidVideoSize(file: File): boolean {
  return file.size <= MAX_VIDEO_SIZE
}

// Get video duration
export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "metadata"

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }

    video.onerror = () => {
      reject(new Error("Could not load video metadata"))
    }

    video.src = URL.createObjectURL(file)
  })
}

// Check if video duration is valid for story
export async function isValidStoryVideoDuration(file: File): Promise<boolean> {
  try {
    const duration = await getVideoDuration(file)
    return duration >= MIN_VIDEO_DURATION && duration <= MAX_STORY_VIDEO_DURATION
  } catch (error) {
    console.error("Error checking video duration:", error)
    return false
  }
}

// Check if video duration is valid for reel
export async function isValidReelVideoDuration(file: File): Promise<boolean> {
  try {
    const duration = await getVideoDuration(file)
    return duration >= MIN_VIDEO_DURATION && duration <= MAX_REEL_VIDEO_DURATION
  } catch (error) {
    console.error("Error checking video duration:", error)
    return false
  }
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Format duration for display
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
