import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import TopBar from "@/components/top-bar"
import Sidebar from "@/components/sidebar"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trường Bào Ngư Facebook Automatic Post",
  description: "Automatically post content to Facebook",
  icons: {
    icon: '/image.png', // Correct path for files in the public directory
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen w-full flex-col">
            <TopBar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
