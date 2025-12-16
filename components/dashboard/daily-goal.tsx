"use client"

import { motion } from "framer-motion"
import { useUser } from "@/lib/user-context"
import { Target, Flame, Zap } from "lucide-react"

export function DailyGoal() {
  const { user } = useUser()
  if (!user) return null

  const dailyGoal = 100
  const todayXP = user.xp % dailyGoal
  const progress = (todayXP / dailyGoal) * 100

  return (
    <section id="daily-goal-section" className="px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Daily Goal</h3>
                <p className="text-sm text-muted-foreground">Earn {dailyGoal} XP today</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-foreground">{user.streak} day streak</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {todayXP} / {dailyGoal} XP
            </span>
            <div className="flex items-center gap-1 text-primary">
              <Zap className="w-4 h-4" />
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
