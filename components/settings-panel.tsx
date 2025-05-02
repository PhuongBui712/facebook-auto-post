"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "@/lib/use-translation"

export function SettingsPanel() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t("Language")}</h3>
        <RadioGroup value={language} onValueChange={(value) => setLanguage(value as "en" | "vi")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="en" id="language-en" />
            <Label htmlFor="language-en">English</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vi" id="language-vi" />
            <Label htmlFor="language-vi">Tiếng Việt</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t("Theme")}</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <Label htmlFor="theme-toggle">{theme === "dark" ? t("Dark") : t("Light")}</Label>
        </div>
      </div>
    </div>
  )
}
