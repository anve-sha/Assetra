"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <RadioGroup 
        defaultValue={theme} 
        onValueChange={setTheme}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
    >
      <div>
        <RadioGroupItem value="light" id="light" className="peer sr-only" />
        <Label
          htmlFor="light"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Sun className="mb-2 h-6 w-6" />
          Light
        </Label>
      </div>

      <div>
        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
        <Label
          htmlFor="dark"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Moon className="mb-2 h-6 w-6" />
          Dark
        </Label>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <RadioGroupItem value="system" id="system" className="peer sr-only" />
        <Label
          htmlFor="system"
          className={cn(
            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
            "peer-data-[state=checked]:border-slate-400 [&:has([data-state=checked])]:border-slate-400",
            "dark:peer-data-[state=checked]:border-slate-600 dark:[&:has([data-state=checked])]:border-slate-600",
          )}
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 h-6 w-6"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
          System
        </Label>
      </div>
    </RadioGroup>
  )
}
