"use client"

import { motion } from "framer-motion"
import { useUser } from "@/lib/user-context"
import { Code, Shield, Brain, Rocket, Edit2, Settings, LogOut } from "lucide-react"
import BlinkingAvatar from "./animated-avatar"
import { DailyGoal } from "./daily-goal"
import { StreakCalendar } from "./streak-calendar"

const levelTitles = [
  "Novice",
  "Apprentice",
  "Learner",
  "Student",
  "Scholar",
  "Adept",
  "Expert",
  "Master",
  "Grandmaster",
  "Legend",
]

export function ProfileSection() {
  const { user, setUser } = useUser()
  if (!user) return null

  const levelTitle = levelTitles[Math.min(Math.floor(user.level / 2), levelTitles.length - 1)]
  const xpForNextLevel = 500
  const xpProgress = ((user.xp % xpForNextLevel) / xpForNextLevel) * 100

  const handleLogout = () => {
    localStorage.removeItem("xyber-user")
    setUser(null)
  }

  return (
    <section id="profile-section" className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <BlinkingAvatar />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors z-10">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground mb-4">
                Level {user.level} {levelTitle}
              </p>

              {/* XP Bar */}
              <div className="max-w-xs mx-auto sm:mx-0">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">XP Progress</span>
                  <span className="text-primary font-medium">
                    {user.xp % xpForNextLevel}/{xpForNextLevel}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{user.xp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{user.completedLessons.length}</p>
                <p className="text-xs text-muted-foreground">Lessons</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{user.badges.length}</p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DailyGoal />
          <StreakCalendar />
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <button className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors text-left">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground font-medium">Settings</span>
          </button>

          <button
            onClick={() => {
              const confirmed = window.confirm("Are you sure you want to reset your progress? This cannot be undone.")
              if (confirmed) {
                const newUser = { ...user, xp: 0, level: 1, badges: [], completedLessons: [] }
                setUser(newUser)
                localStorage.setItem("xyber-user", JSON.stringify(newUser))
              }
            }}
            className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-destructive/50 transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-destructive" />
            <span className="text-destructive font-medium">Reset Progress</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-destructive/50 transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-destructive" />
            <span className="text-destructive font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </section>
  )
}
