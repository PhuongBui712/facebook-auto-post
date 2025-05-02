"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { FileImage, Film, Video, VideoIcon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTranslation } from "@/lib/use-translation"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      name: "Feed",
      path: "/feed",
      icon: FileImage,
    },
    {
      name: "Story",
      path: "/story",
      icon: Film,
    },
    {
      name: "Reel",
      path: "/reel",
      icon: Video,
    },
    {
      name: "Video",
      path: "/video",
      icon: VideoIcon,
    },
  ]

  const NavItems = () => (
    <div className="flex flex-col gap-2 p-2">
      {routes.map((route) => (
        <Link key={route.path} href={route.path} onClick={() => setOpen(false)}>
          <Button
            variant={pathname === route.path ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              pathname === route.path ? "bg-red-600 text-white hover:bg-red-700" : "",
            )}
          >
            <route.icon className="h-5 w-5" />
            <span>{t(route.name)}</span>
          </Button>
        </Link>
      ))}
    </div>
  )

  // Mobile sidebar
  const MobileSidebar = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <h2 className="text-lg font-bold">{t("Navigation")}</h2>
          </div>
          <NavItems />
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      <MobileSidebar />
      <div className="hidden w-64 flex-shrink-0 border-r bg-background md:block">
        <div className="flex h-full flex-col">
          <NavItems />
        </div>
      </div>
    </>
  )
}
