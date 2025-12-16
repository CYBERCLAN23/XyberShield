"use client"

import { motion } from "framer-motion"
import { useUser } from "@/lib/user-context"
import { Trophy, Medal, Crown, TrendingUp, Code, Shield, Brain, Rocket } from "lucide-react"

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

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, name: "CyberNinja", avatar: "guardian", xp: 12500, level: 25 },
  { rank: 2, name: "CodeWizard", avatar: "coder", xp: 11200, level: 22 },
  { rank: 3, name: "DataMaster", avatar: "thinker", xp: 9800, level: 20 },
  { rank: 4, name: "TechExplorer", avatar: "explorer", xp: 8500, level: 17 },
  { rank: 5, name: "WebBuilder", avatar: "coder", xp: 7200, level: 15 },
  { rank: 6, name: "SecureHacker", avatar: "guardian", xp: 6100, level: 12 },
  { rank: 7, name: "AILearner", avatar: "thinker", xp: 5500, level: 11 },
]

export function Leaderboard() {
  const { user } = useUser()

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="text-muted-foreground font-bold">#{rank}</span>
  }

  return (
    <section className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Leaderboard</h2>
              <p className="text-sm text-muted-foreground">Top learners this week</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7">Learner</div>
            <div className="col-span-2 text-right">Level</div>
            <div className="col-span-2 text-right">XP</div>
          </div>

          {/* Rows */}
          {leaderboardData.map((entry, index) => {
            const AvatarIcon = avatarIcons[entry.avatar as keyof typeof avatarIcons] || Code
            const avatarColor = avatarColors[entry.avatar as keyof typeof avatarColors] || "#38bdf8"
            const isCurrentUser = user?.name === entry.name

            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-border last:border-b-0 ${
                  isCurrentUser ? "bg-primary/5" : "hover:bg-muted/50"
                } transition-colors`}
              >
                <div className="col-span-1 flex justify-center">{getRankIcon(entry.rank)}</div>
                <div className="col-span-7 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${avatarColor}20` }}
                  >
                    <AvatarIcon className="w-5 h-5" style={{ color: avatarColor }} />
                  </div>
                  <span className="font-semibold text-foreground truncate">{entry.name}</span>
                  {isCurrentUser && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">You</span>
                  )}
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-foreground font-medium">Lvl {entry.level}</span>
                </div>
                <div className="col-span-2 text-right flex items-center justify-end gap-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-semibold">{entry.xp.toLocaleString()}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
