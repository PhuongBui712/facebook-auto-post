"use client"

import Image from "next/image"
import Link from "next/link"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SettingsPanel } from "@/components/settings-panel"
import { useTranslation } from "@/lib/use-translation"

export default function TopBar() {
  const { t } = useTranslation()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/image.png"
          alt="Trường Bào Ngư Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="hidden text-lg font-bold md:inline-block">{t("Trường Bào Ngư Facebook Automatic Post")}</span>
        <span className="text-lg font-bold md:hidden">{t("TBN Auto Post")}</span>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">{t("Settings")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("Settings")}</SheetTitle>
          </SheetHeader>
          <SettingsPanel />
        </SheetContent>
      </Sheet>
    </header>
  )
}
