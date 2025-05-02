"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "vi"

interface TranslationContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const translations = {
  en: {
    Navigation: "Navigation",
    Settings: "Settings",
    Language: "Language",
    Theme: "Theme",
    Dark: "Dark",
    Light: "Light",
    Feed: "Feed",
    Story: "Story",
    Reel: "Reel",
    Video: "Video",
    Post: "Post",
    "Submitting...": "Submitting...",
    "Task submitted successfully!": "Task submitted successfully!",
    "Your feed post is being processed.": "Your feed post is being processed.",
    "Your story is being processed.": "Your story is being processed.",
    "Your reel is being processed.": "Your reel is being processed.",
    "Your video is being processed.": "Your video is being processed.",
    Error: "Error",
    "Failed to submit your post. Please try again.": "Failed to submit your post. Please try again.",
    "Failed to submit your story. Please try again.": "Failed to submit your story. Please try again.",
    "Failed to submit your reel. Please try again.": "Failed to submit your reel. Please try again.",
    "Failed to submit your video. Please try again.": "Failed to submit your video. Please try again.",
    Photos: "Photos",
    Photo: "Photo",
    "Story Type": "Story Type",
    "Click or Drag & Drop photo(s) here": "Click or Drag & Drop photo(s) here",
    "Click or Drag & Drop photo here": "Click or Drag & Drop photo here",
    "Click or Drag & Drop video here": "Click or Drag & Drop video here",
    "Supported formats: PNG, JPG, JPEG, WEBP": "Supported formats: PNG, JPG, JPEG, WEBP",
    "Supported formats: MP4": "Supported formats: MP4",
    "Select File": "Select File",
    "Add More Files": "Add More Files",
    "Change File": "Change File",
    Remove: "Remove",
    "Task Results": "Task Results",
    "Task ID": "Task ID",
    "Loading results...": "Loading results...",
    "Try Again": "Try Again",
    "No results available yet. Please check back later.": "No results available yet. Please check back later.",
    "View on Facebook": "View on Facebook",
    "Trường Bào Ngư Facebook Automatic Post": "Trường Bào Ngư Facebook Automatic Post",
    "TBN Auto Post": "TBN Auto Post",
    "Uploading...": "Uploading...",
    "Upload Error": "Upload Error",
    "Failed to upload one or more files. Please try again.": "Failed to upload one or more files. Please try again.",
    Status: "Status",
    "Result not available yet or processing": "Result not available yet or processing",
    "Failed to fetch result": "Failed to fetch result",
    "Task not found": "Task not found",
    "Task is still being processed.": "Task is still being processed.",
    "Error reading result file.": "Error reading result file.",
    Duration: "Duration",
    seconds: "seconds",
    "Max size": "Max size",
    "Only PNG, JPG, JPEG, and WEBP files are allowed": "Only PNG, JPG, JPEG, and WEBP files are allowed",
    "Only MP4 video files are allowed": "Only MP4 video files are allowed",
    "Video is too short. Minimum duration is": "Video is too short. Minimum duration is",
    "Video is too long. Maximum duration is": "Video is too long. Maximum duration is",
    "File size exceeds the maximum limit of": "File size exceeds the maximum limit of",
    "Could not validate video duration. Please check file format.":
      "Could not validate video duration. Please check file format.",
  },
  vi: {
    Navigation: "Điều hướng",
    Settings: "Cài đặt",
    Language: "Ngôn ngữ",
    Theme: "Giao diện",
    Dark: "Tối",
    Light: "Sáng",
    Feed: "Bài đăng",
    Story: "Tin",
    Reel: "Reels",
    Video: "Video",
    Post: "Đăng",
    "Submitting...": "Đang gửi...",
    "Task submitted successfully!": "Đã gửi thành công!",
    "Your feed post is being processed.": "Bài đăng của bạn đang được xử lý.",
    "Your story is being processed.": "Tin của bạn đang được xử lý.",
    "Your reel is being processed.": "Reels của bạn đang được xử lý.",
    "Your video is being processed.": "Video của bạn đang được xử lý.",
    Error: "Lỗi",
    "Failed to submit your post. Please try again.": "Không thể gửi bài đăng. Vui lòng thử lại.",
    "Failed to submit your story. Please try again.": "Không thể gửi tin. Vui lòng thử lại.",
    "Failed to submit your reel. Please try again.": "Không thể gửi reels. Vui lòng thử lại.",
    "Failed to submit your video. Please try again.": "Không thể gửi video. Vui lòng thử lại.",
    Photos: "Hình ảnh",
    Photo: "Hình ảnh",
    "Story Type": "Loại tin",
    "Click or Drag & Drop photo(s) here": "Nhấp hoặc kéo & thả ảnh vào đây",
    "Click or Drag & Drop photo here": "Nhấp hoặc kéo & thả ảnh vào đây",
    "Click or Drag & Drop video here": "Nhấp hoặc kéo & thả video vào đây",
    "Supported formats: PNG, JPG, JPEG, WEBP": "Định dạng hỗ trợ: PNG, JPG, JPEG, WEBP",
    "Supported formats: MP4": "Định dạng hỗ trợ: MP4",
    "Select File": "Chọn tệp",
    "Add More Files": "Thêm tệp",
    "Change File": "Đổi tệp",
    Remove: "Xóa",
    "Task Results": "Kết quả nhiệm vụ",
    "Task ID": "Mã nhiệm vụ",
    "Loading results...": "Đang tải kết quả...",
    "Try Again": "Thử lại",
    "No results available yet. Please check back later.": "Chưa có kết quả. Vui lòng kiểm tra lại sau.",
    "View on Facebook": "Xem trên Facebook",
    "Trường Bào Ngư Facebook Automatic Post": "Trường Bào Ngư Đăng Bài Facebook Tự Động",
    "TBN Auto Post": "TBN Đăng Tự Động",
    "Uploading...": "Đang tải lên...",
    "Upload Error": "Lỗi tải lên",
    "Failed to upload one or more files. Please try again.": "Không thể tải lên một hoặc nhiều tệp. Vui lòng thử lại.",
    Status: "Trạng thái",
    "Result not available yet or processing": "Kết quả chưa có hoặc đang xử lý",
    "Failed to fetch result": "Không thể lấy kết quả",
    "Task not found": "Không tìm thấy nhiệm vụ",
    "Task is still being processed.": "Nhiệm vụ vẫn đang được xử lý.",
    "Error reading result file.": "Lỗi khi đọc tệp kết quả.",
    Duration: "Thời lượng",
    seconds: "giây",
    "Max size": "Kích thước tối đa",
    "Only PNG, JPG, JPEG, and WEBP files are allowed": "Chỉ chấp nhận tệp PNG, JPG, JPEG và WEBP",
    "Only MP4 video files are allowed": "Chỉ chấp nhận tệp video MP4",
    "Video is too short. Minimum duration is": "Video quá ngắn. Thời lượng tối thiểu là",
    "Video is too long. Maximum duration is": "Video quá dài. Thời lượng tối đa là",
    "File size exceeds the maximum limit of": "Kích thước tệp vượt quá giới hạn tối đa",
    "Could not validate video duration. Please check file format.":
      "Không thể xác nhận thời lượng video. Vui lòng kiểm tra định dạng tệp.",
  },
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("truong-bao-ngu-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vi")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("truong-bao-ngu-language", newLanguage)
  }

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)

  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }

  return context
}
