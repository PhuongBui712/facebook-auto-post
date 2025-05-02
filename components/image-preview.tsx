"use client"

import { memo } from "react"
import Image from "next/image"

interface ImagePreviewProps {
  file: File
  className?: string
}

// Using memo to prevent unnecessary re-renders
const ImagePreview = memo(function ImagePreview({ file, className }: ImagePreviewProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg">
      <Image src={URL.createObjectURL(file) || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
    </div>
  )
})

export default ImagePreview
