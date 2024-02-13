import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "./ui/label"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isDarkMode } from "@/store/userStore"

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<
    "theme-light" | "dark" | "system"
  >("theme-light")

  React.useEffect(() => {
    const isDarkMode = typeof localStorage !== undefined && localStorage.getItem("theme") === "dark"
    document.documentElement.classList[isDarkMode ? "add" : "remove"]("dark");
    setThemeState(isDarkMode ? "dark" : "theme-light")
  }, [])

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
    localStorage.setItem('theme', isDark ? "dark" : "light")
    isDarkMode.set(isDark ? true : false)
  }, [theme])

  return (
    <div className="flex items-center p-3 gap-3">
      <div onClick={() => {
        setThemeState(prev => (prev === "dark" ? "theme-light" : "dark"))
      }}>
        <Switch id="theme" checked={theme === "dark"} />
      </div>
      <Label htmlFor="theme">Dark Mode</Label>
    </div>
  )
}