"use client"

import type React from "react"

import { motion } from "framer-motion"
import { learningPaths } from "@/lib/learning-paths"
import { useUser } from "@/lib/user-context"
import { Globe, Shield, Brain, Smartphone, Cloud, Server, ChevronRight, Clock } from "lucide-react"

const pathIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  shield: Shield,
  brain: Brain,
  smartphone: Smartphone,
  cloud: Cloud,
  server: Server,
}

export function LearningPathsSection() {
  const { user, setUser } = useUser()

  const handleSelectPath = (pathId: string) => {
    if (!user) return
    setUser({ ...user, selectedPath: pathId })
  }

  return (
    <section id="learning-paths-section" className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Choose Your Path</h2>
            <p className="text-sm text-muted-foreground">Pick a domain to master</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningPaths.map((path, index) => {
            const Icon = pathIcons[path.icon] || Globe
            const isSelected = user?.selectedPath === path.id

            return (
              <motion.button
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectPath(path.id)}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all group overflow-hidden ${isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                  }`}
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${path.color}15, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${path.color}20` }}
                  >
                    <Icon className="w-6 h-6 text-foreground/80" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-foreground mb-1">{path.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{path.description}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {path.estimatedHours}h
                      </span>
                      <span className="capitalize px-2 py-0.5 rounded-full bg-muted">{path.difficulty}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>

                {isSelected && <div className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full" />}
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
