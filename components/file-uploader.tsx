"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import FileUpload from "@/components/file-upload"
import { useTranslation } from "@/lib/use-translation"

interface FileUploaderProps {
  accept: string
  multiple?: boolean
  onChange: (filePaths: string[]) => void
  value: File[]
  setValue: (files: File[]) => void
  type: "photo" | "video"
  className?: string
}

export default function FileUploader({
  accept,
  multiple = false,
  onChange,
  value,
  setValue,
  type,
  className,
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation()

  // This function handles the actual upload to the server
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (!files.length) return []

    setIsUploading(true)
    const filePaths: string[] = []

    try {
      // Upload each file
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const data = await response.json()
        if (data.success && data.filepath) {
          filePaths.push(data.filepath)
        }
      }

      return filePaths
    } catch (error) {
      console.error("Error uploading files:", error)
      toast({
        title: t("Upload Error"),
        description: t("Failed to upload one or more files. Please try again."),
        variant: "destructive",
      })
      return []
    } finally {
      setIsUploading(false)
    }
  }

  const handleFilesChange = async (files: File[]) => {
    setValue(files)

    // If files were added, upload them immediately
    if (files.length > 0) {
      const paths = await uploadFiles(files)
      onChange(paths)
    } else {
      // If files were removed, clear the paths
      onChange([])
    }
  }

  return (
    <FileUpload
      accept={accept}
      multiple={multiple}
      onChange={handleFilesChange}
      value={value}
      type={type}
      className={className}
      isUploading={isUploading}
    />
  )
}
