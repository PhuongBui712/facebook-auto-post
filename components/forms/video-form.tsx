"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import FileUploader from "@/components/file-uploader"
import { useTranslation } from "@/lib/use-translation"

export default function VideoForm() {
  const [caption, setCaption] = useState("")
  const [video, setVideo] = useState<File[]>([])
  const [videoPath, setVideoPath] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState<File[]>([])
  const [thumbnailPath, setThumbnailPath] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useTranslation()

  const isFormValid = videoPath.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsSubmitting(true)

    try {
      // Generate a unique task ID
      const taskId = uuidv4()

      // Prepare payload
      const payload: any = {
        caption,
        video: videoPath[0],
        task_id: taskId,
      }

      if (thumbnailPath.length > 0) {
        payload.thumbnail = thumbnailPath[0]
      }

      // Send to the backend API
      const response = await fetch("http://localhost:8000/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Show success toast
      toast({
        title: t("Task submitted successfully!"),
        description: t("Your video is being processed."),
      })

      // Reset form
      setCaption("")
      setVideo([])
      setVideoPath([])
      setThumbnail([])
      setThumbnailPath([])

      // Redirect to results page
      router.push(`/results/${taskId}`)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: t("Error"),
        description: t("Failed to submit your video. Please try again."),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="caption">{language === "en" ? "Caption" : "Dòng trạng thái"}</Label>
            <Textarea
              id="caption"
              placeholder={language === "en" ? "Write caption for your Video" : "Bạn đang nghĩ gì?"}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("Video")}</Label>
            <FileUploader
              accept="video/mp4"
              multiple={false}
              onChange={setVideoPath}
              value={video}
              setValue={setVideo}
              type="video"
              maxSizeMB={2048} // 2GB
              videoType="video"
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "en" ? "Thumbnail (Optional)" : "Ảnh bìa (Không bắt buộc)"}</Label>
            <FileUploader
              accept="image/png,image/jpeg,image/jpg,image/webp"
              multiple={false}
              onChange={setThumbnailPath}
              value={thumbnail}
              setValue={setThumbnail}
              type="photo"
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? t("Submitting...") : t("Post")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
