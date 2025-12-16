"use client"

import { useState, useEffect } from "react"
import { Bell, Zap } from "lucide-react"
import Image from "next/image"

export function GamificationBar() {
  const [currentXp] = useState(350)
  const [showXpToast, setShowXpToast] = useState(false)
  const maxXp = 500

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowXpToast(true)
      setTimeout(() => setShowXpToast(false), 2000)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* XP Toast */}
      {showXpToast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30">
            <Zap className="w-4 h-4 text-[#22c55e]" fill="#22c55e" />
            <span className="font-semibold text-[#22c55e] text-sm">+50 XP</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="XyberShield" width={36} height={36} className="rounded-lg" />
              <div className="flex items-center">
                <span className="font-bold text-lg text-[#22c55e]">XYBER</span>
                <span className="font-bold text-lg text-foreground">SHIELD</span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Level & XP */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-xs font-bold text-black">
                    1
                  </div>
                  <span className="text-sm text-muted-foreground">Novice</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-[#262626] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#22c55e] rounded-full transition-all duration-700"
                      style={{ width: `${(currentXp / maxXp) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {currentXp}/{maxXp}
                  </span>
                </div>
              </div>

              {/* Bell */}
              <button className="relative p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#22c55e] rounded-full" />
              </button>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#262626]" />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
