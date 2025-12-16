"use client"

import Image from "next/image"
import { useUser } from "@/lib/user-context"
import { Bell, Flame, Code, Shield, Brain, Rocket } from "lucide-react"
import { motion } from "framer-motion"

const avatarIcons = {
  coder: Code,
  guardian: Shield,
  thinker: Brain,
  explorer: Rocket,
}

const avatarColors = {
  coder: "#38bdf8",
  guardian: "#14b8a6",
  thinker: "#a855f7",
  explorer: "#fb923c",
}

export function Header() {
  const { user } = useUser()
  if (!user) return null

  const AvatarIcon = avatarIcons[user.avatar as keyof typeof avatarIcons] || Code
  const avatarColor = avatarColors[user.avatar as keyof typeof avatarColors] || "#38bdf8"
  const xpProgress = ((user.xp % 500) / 500) * 100

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="XyberShield" width={32} height={32} />
          <span className="font-bold text-foreground hidden sm:block">
            Xyber<span className="text-primary">Shield</span>
          </span>
        </div>

        {/* XP & Level */}
        <div className="flex items-center gap-4">
          {/* Streak */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 rounded-full">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-500">{user.streak}</span>
          </div>

          {/* XP Progress */}
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Level {user.level}</span>
              <span className="text-xs font-semibold text-primary">{user.xp} XP</span>
            </div>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-card transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: avatarColor, backgroundColor: `${avatarColor}20` }}
          >
            <AvatarIcon className="w-5 h-5" style={{ color: avatarColor }} />
          </div>
        </div>
      </div>
    </header>
  )
}
