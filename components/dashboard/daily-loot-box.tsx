"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/lib/progress"
import confetti from "canvas-confetti"

export function DailyLootBox() {
    const { addXp } = useProgress()
    const [isOpen, setIsOpen] = useState(false)
    const [isClaimed, setIsClaimed] = useState(false)
    const [reward, setReward] = useState<{ xp: number } | null>(null)
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null)

    useEffect(() => {
        // Check local storage for last claim
        const lastClaimDate = localStorage.getItem("xyber_daily_reward_date")
        const today = new Date().toDateString()

        if (lastClaimDate === today) {
            setIsClaimed(true)
            calculateTimeRemaining()
        }
    }, [])

    const calculateTimeRemaining = () => {
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)

        const diff = tomorrow.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        setTimeRemaining(`${hours}h ${minutes}m`)
    }

    const handleOpen = () => {
        if (isClaimed) return

        // Reward logic
        const xpAmount = [50, 100, 150, 500][Math.floor(Math.random() * 4)]
        setReward({ xp: xpAmount })
        setIsOpen(true)

        // Confetti effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#a855f7', '#ec4899', '#eab308']
        })

        // Save claim
        localStorage.setItem("xyber_daily_reward_date", new Date().toDateString())
        setIsClaimed(true)
        addXp(xpAmount)
        calculateTimeRemaining()
    }

    return (
        <div className="relative group">
            <div className={`
                relative w-full overflow-hidden rounded-2xl border p-4 transition-all duration-300
                ${isClaimed
                    ? "bg-gray-900/50 border-gray-800 opacity-80 grayscale"
                    : "bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/40 border-indigo-500/30 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                }
            `}>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={!isClaimed ? { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } } : {}}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${isClaimed ? "bg-gray-800" : "bg-gradient-to-br from-indigo-500 to-purple-600"}`}
                        >
                            <Gift className={`w-6 h-6 text-white ${!isClaimed && "animate-bounce"}`} />
                        </motion.div>
                        <div>
                            <h3 className="font-bold text-white">Daily Loot</h3>
                            <p className="text-xs text-gray-400">
                                {isClaimed ? `Next in: ${timeRemaining}` : "Tap to claim free XP!"}
                            </p>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        disabled={isClaimed}
                        onClick={handleOpen}
                        className={`
                            ${isClaimed
                                ? "bg-gray-800 text-gray-500"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white animate-pulse"
                            }
                        `}
                    >
                        {isClaimed ? "Claimed" : "Open"}
                    </Button>
                </div>
            </div>

            {/* Modal for Reward */}
            <AnimatePresence>
                {isOpen && reward && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1e1e1e] border-2 border-indigo-500 rounded-3xl p-8 max-w-sm w-full text-center relative shadow-[0_0_50px_rgba(99,102,241,0.5)]"
                        >
                            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-6"
                            >
                                <Zap className="w-12 h-12 text-white fill-current" />
                            </motion.div>

                            <h2 className="text-3xl font-black text-white mb-2">+{reward.xp} XP</h2>
                            <p className="text-indigo-300 font-medium mb-6">Legendary Drop!</p>

                            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl" onClick={() => setIsOpen(false)}>
                                Awesome!
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
