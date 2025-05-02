"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { FileImage, Upload, X, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/use-translation"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  accept: string
  multiple?: boolean
  onChange: (files: File[]) => void
  value: File[]
  type: "photo" | "video"
  className?: string
  isUploading?: boolean
}

export default function FileUpload({
  accept,
  multiple = false,
  onChange,
  value,
  type,
  className,
  isUploading = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.match(accept.replace(/,/g, "|").replace(/\*/g, ".*")),
      )

      if (files.length > 0) {
        if (multiple) {
          onChange([...value, ...files])
        } else {
          onChange([files[0]])
        }
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      if (multiple) {
        onChange([...value, ...files])
      } else {
        onChange([files[0]])
      }
    }
  }

  const handleRemove = (index: number) => {
    const newFiles = [...value]
    newFiles.splice(index, 1)
    onChange(newFiles)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const renderIcon = () => {
    if (type === "photo") {
      return <FileImage className="h-10 w-10 text-muted-foreground" />
    } else {
      return <Film className="h-10 w-10 text-muted-foreground" />
    }
  }

  const renderPlaceholder = () => {
    if (type === "photo") {
      return multiple ? t("Click or Drag & Drop photo(s) here") : t("Click or Drag & Drop photo here")
    } else {
      return t("Click or Drag & Drop video here")
    }
  }

  const renderPreview = () => {
    if (value.length === 0) return null

    return (
      <div className={cn("mt-4 space-y-4", multiple ? "grid grid-cols-2 gap-4 md:grid-cols-3" : "")}>
        {value.map((file, index) => (
          <div key={index} className="relative rounded-lg border">
            {file.type.includes("image") ? (
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={file.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <video src={URL.createObjectURL(file)} controls className="max-h-[300px] w-auto rounded-lg" />
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t("Remove")}</span>
            </Button>
            <div className="p-2 text-xs text-muted-foreground">{file.name}</div>
          </div>
        ))}
      </div>
    )
  }

  const renderUploadStatus = () => {
    if (!isUploading) return null

    return (
      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span>{t("Uploading...")}</span>
      </div>
    )
  }

  return (
    <div className={className}>
      {value.length === 0 && (
        <div
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
            dragActive ? "border-primary bg-muted/50" : "border-muted-foreground/25",
            isUploading ? "opacity-50 pointer-events-none" : "",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {renderIcon()}
          <div className="mt-2 text-center">
            <p className="text-sm font-medium">{renderPlaceholder()}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {type === "photo" ? t("Supported formats: JPG, PNG, GIF, WEBP") : t("Supported formats: MP4, MOV")}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            disabled={isUploading}
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t("Select File")}
          </Button>
          {renderUploadStatus()}
        </div>
      )}

      {renderPreview()}

      {value.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {multiple ? t("Add More Files") : t("Change File")}
          </Button>
          {renderUploadStatus()}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  )
}
