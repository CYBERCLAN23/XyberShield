"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"

interface XPToastProps {
  amount: number
  show: boolean
  onHide: () => void
}

export function XPToast({ amount, show, onHide }: XPToastProps) {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(onHide, 2500)
      return () => clearTimeout(timeout)
    }
  }, [show, onHide])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/30">
            <Zap className="w-5 h-5 text-amber-950" />
            <span className="font-bold text-amber-950">+{amount} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
