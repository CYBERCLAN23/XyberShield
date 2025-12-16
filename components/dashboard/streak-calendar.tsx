"use client"

import { motion } from "framer-motion"
import { useUser } from "@/lib/user-context"
import { Flame, Check } from "lucide-react"

export function StreakCalendar() {
  const { user } = useUser()
  if (!user) return null

  // Generate last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      isActive: i >= 7 - user.streak, // Active if within streak
      isToday: i === 6,
    }
  })

  return (
    <section className="px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{user.streak} Day Streak!</h3>
                <p className="text-sm text-muted-foreground">Keep it going!</p>
              </div>
            </div>
          </div>

          {/* Calendar row */}
          <div className="flex justify-between gap-2">
            {days.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center flex-1"
              >
                <span className="text-xs text-muted-foreground mb-2">{day.day}</span>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    day.isActive
                      ? day.isToday
                        ? "bg-amber-500 text-amber-950"
                        : "bg-amber-500/20 text-amber-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day.isActive ? <Check className="w-5 h-5" /> : <span className="text-sm">{day.date}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
