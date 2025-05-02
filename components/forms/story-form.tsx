"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import FileUploader from "@/components/file-uploader"
import { useTranslation } from "@/lib/use-translation"

export default function StoryForm() {
  const [storyType, setStoryType] = useState<"photo" | "video">("photo")
  const [photo, setPhoto] = useState<File[]>([])
  const [photoPath, setPhotoPath] = useState<string[]>([])
  const [video, setVideo] = useState<File[]>([])
  const [videoPath, setVideoPath] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useTranslation()

  const isFormValid = (storyType === "photo" && photoPath.length > 0) || (storyType === "video" && videoPath.length > 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsSubmitting(true)

    try {
      // Generate a unique task ID
      const taskId = uuidv4()

      // Prepare payload based on story type
      let endpoint = ""
      const payload: any = { task_id: taskId }

      if (storyType === "photo" && photoPath.length > 0) {
        endpoint = "http://localhost:8000/story/photo"
        payload.photo = photoPath[0]
      } else if (storyType === "video" && videoPath.length > 0) {
        endpoint = "http://localhost:8000/story/video"
        payload.video = videoPath[0]
      }

      // Send to the backend API
      const response = await fetch(endpoint, {
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
        description: t("Your story is being processed."),
      })

      // Reset form
      setPhoto([])
      setPhotoPath([])
      setVideo([])
      setVideoPath([])

      // Redirect to results page
      router.push(`/results/${taskId}`)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: t("Error"),
        description: t("Failed to submit your story. Please try again."),
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
            <Label>{t("Story Type")}</Label>
            <RadioGroup
              value={storyType}
              onValueChange={(value) => {
                setStoryType(value as "photo" | "video")
                // Clear the other type's files when switching
                if (value === "photo") {
                  setVideo([])
                  setVideoPath([])
                } else {
                  setPhoto([])
                  setPhotoPath([])
                }
              }}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="photo" id="story-photo" />
                <Label htmlFor="story-photo">{t("Photo")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="story-video" />
                <Label htmlFor="story-video">{t("Video")}</Label>
              </div>
            </RadioGroup>
          </div>

          {storyType === "photo" && (
            <div className="space-y-2">
              <Label>{t("Photo")}</Label>
              <FileUploader
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple={false}
                onChange={setPhotoPath}
                value={photo}
                setValue={setPhoto}
                type="photo"
              />
            </div>
          )}

          {storyType === "video" && (
            <div className="space-y-2">
              <Label>{t("Video")}</Label>
              <FileUploader
                accept="video/mp4"
                multiple={false}
                onChange={setVideoPath}
                value={video}
                setValue={setVideo}
                type="video"
                minDuration={3}
                maxDuration={60}
                videoType="story"
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? t("Submitting...") : t("Post")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
