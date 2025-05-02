import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ValidationResult {
  isValid: boolean
  message?: string
}

// File type validation
export function validateFileType(file: File, type: "photo" | "video"): ValidationResult {
  if (type === "photo") {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
    const validExtensions = [".png", ".jpg", ".jpeg", ".webp"]

    if (!validTypes.includes(file.type.toLowerCase())) {
      // Second check with extension in case the MIME type is incorrect
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      if (!validExtensions.some((ext) => fileExtension.endsWith(ext))) {
        return {
          isValid: false,
          message: "Only PNG, JPG, JPEG, and WEBP files are allowed",
        }
      }
    }
  } else if (type === "video") {
    const validTypes = ["video/mp4"]
    const validExtensions = [".mp4"]

    if (!validTypes.includes(file.type.toLowerCase())) {
      // Second check with extension in case the MIME type is incorrect
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      if (!validExtensions.some((ext) => fileExtension.endsWith(ext))) {
        return {
          isValid: false,
          message: "Only MP4 video files are allowed",
        }
      }
    }
  }

  return { isValid: true }
}

// File size validation (in bytes)
export function validateFileSize(file: File, maxSizeBytes: number): ValidationResult {
  if (file.size > maxSizeBytes) {
    const maxSizeMB = maxSizeBytes / (1024 * 1024)
    return {
      isValid: false,
      message: `File size exceeds the maximum limit of ${maxSizeMB} MB`,
    }
  }
  return { isValid: true }
}

// Video duration validation
export async function validateVideoDuration(
  file: File,
  minDuration: number,
  maxDuration: number,
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const video = document.createElement("video")
    video.preload = "metadata"

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      const duration = video.duration

      if (duration < minDuration) {
        resolve({
          isValid: false,
          message: `Video is too short. Minimum duration is ${minDuration} seconds.`,
        })
      } else if (duration > maxDuration) {
        resolve({
          isValid: false,
          message: `Video is too long. Maximum duration is ${maxDuration} seconds.`,
        })
      } else {
        resolve({ isValid: true })
      }
    }

    video.onerror = () => {
      resolve({
        isValid: false,
        message: "Could not validate video duration. Please check file format.",
      })
    }

    video.src = URL.createObjectURL(file)
  })
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
