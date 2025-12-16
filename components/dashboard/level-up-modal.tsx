"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Star, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

interface LevelUpModalProps {
  show: boolean
  level: number
  onClose: () => void
}

export function LevelUpModal({ show, level, onClose }: LevelUpModalProps) {
  const { width, height } = useWindowSize()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-card rounded-3xl p-8 text-center max-w-sm w-full border border-border relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <Star className="w-8 h-8 text-primary-foreground" fill="currentColor" />
                </div>
              </div>
            </motion.div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 font-semibold uppercase tracking-wider text-sm">Level Up!</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-2">Level {level}</h2>
              <p className="text-muted-foreground mb-6">You're making amazing progress!</p>

              <Button
                onClick={onClose}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Keep Learning
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
