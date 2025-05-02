"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { TranslationProvider } from "@/lib/use-translation"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="truong-bao-ngu-theme">
      <TranslationProvider>
        {children}
        <Toaster />
      </TranslationProvider>
    </ThemeProvider>
  )
}
