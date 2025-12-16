"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useUser } from "@/lib/user-context"
import { badges } from "@/lib/badges"
import { Rocket, Play, Star, Flame, TrendingUp, Award, Globe, Shield, Zap, Trophy, Lock } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  play: Play,
  star: Star,
  flame: Flame,
  "trending-up": TrendingUp,
  award: Award,
  globe: Globe,
  shield: Shield,
  zap: Zap,
  trophy: Trophy,
}

export function BadgesSection() {
  const { user } = useUser()
  if (!user) return null

  const earnedBadges = badges.filter((b) => user.badges.includes(b.id))
  const lockedBadges = badges.filter((b) => !user.badges.includes(b.id))

  return (
    <section className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Badges</h2>
            <p className="text-sm text-muted-foreground">
              {earnedBadges.length} of {badges.length} earned
            </p>
          </div>
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Earned</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {earnedBadges.map((badge, index) => {
                const Icon = iconMap[badge.icon] || Star
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col items-center p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${badge.color}20` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: badge.color }} />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm text-center">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Locked</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {lockedBadges.map((badge, index) => {
              const Icon = iconMap[badge.icon] || Star
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex flex-col items-center p-4 bg-card/50 rounded-2xl border border-border opacity-50"
                >
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-muted">
                    <Icon className="w-8 h-8 text-muted-foreground" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-muted-foreground text-sm text-center">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground/70 text-center mt-1">{badge.requirement}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
