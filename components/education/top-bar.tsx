"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Zap, Bell, User } from "lucide-react"
import Image from "next/image"

interface XpToastProps {
  amount: number
  isVisible: boolean
}

function XpToast({ amount, isVisible }: XpToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed top-24 right-8 z-50"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3ddc84]/20 border border-[#3ddc84]/50 glow-green">
            <Zap className="w-5 h-5 text-[#3ddc84]" fill="#3ddc84" />
            <span className="font-bold text-[#3ddc84] text-glow-green">+{amount} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function TopBar() {
  const [currentXp, setCurrentXp] = useState(250)
  const [showXpToast, setShowXpToast] = useState(false)
  const maxXp = 500
  const level = 1
  const levelName = "Novice"

  // Demo XP gain effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowXpToast(true)
      setCurrentXp((prev) => Math.min(prev + 50, maxXp))
      setTimeout(() => setShowXpToast(false), 2000)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <XpToast amount={50} isVisible={showXpToast} />
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-[#3b82f6]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="XyberShield Logo"
                width={40}
                height={40}
                className="drop-shadow-[0_0_8px_rgba(61,220,132,0.5)]"
              />
              <span className="font-[var(--font-orbitron)] font-bold text-xl tracking-wider">
                <span className="text-[#3ddc84]">XYBER</span>
                <span className="text-white">SHIELD</span>
              </span>
            </div>

            {/* Level Progress */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#3b82f6]" />
                <span className="text-sm text-muted-foreground">
                  Level {level}: <span className="text-[#3b82f6] font-semibold">{levelName}</span>
                </span>
              </div>
              <div className="w-48 h-2 bg-[#1e293b] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3b82f6] to-[#3ddc84] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentXp / maxXp) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {currentXp}/{maxXp} XP
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-[#1e293b] transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1e293b] transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#3ddc84] flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
