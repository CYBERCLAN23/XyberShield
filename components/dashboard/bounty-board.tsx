"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, DollarSign, Clock, Shield, Check, Code, Database, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"
import confetti from "canvas-confetti"

interface Bounty {
    id: string
    title: string
    company: string
    description: string
    reward: number
    xp: number
    difficulty: "Easy" | "Medium" | "Hard"
    time: string
    icon: any
    color: string
}

const INITIAL_BOUNTIES: Bounty[] = [
    {
        id: "b1",
        title: "Fix Login Page CSS",
        company: "NeoStart Inc.",
        description: "Login button is not centered on mobile devices. Need quick fix using Flexbox.",
        reward: 50,
        xp: 100,
        difficulty: "Easy",
        time: "1h",
        icon: Globe,
        color: "text-blue-400 border-blue-500/50 hover:bg-blue-500/10"
    },
    {
        id: "b2",
        title: "Audit Payment API",
        company: "CyberBank",
        description: "Review our Node.js endpoint for potential SQL injection vulnerabilities.",
        reward: 500,
        xp: 300,
        difficulty: "Hard",
        time: "12h",
        icon: Shield,
        color: "text-red-400 border-red-500/50 hover:bg-red-500/10"
    },
    {
        id: "b3",
        title: "Optimize DB Queries",
        company: "DataFlow Systems",
        description: "Our PostgreSQL queries are slow. Add indexes to the 'users' table.",
        reward: 150,
        xp: 200,
        difficulty: "Medium",
        time: "4h",
        icon: Database,
        color: "text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/10"
    }
]

export function BountyBoard() {
    const { addCredits, addXp } = useUser()
    const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES)
    const [activeBounty, setActiveBounty] = useState<Bounty | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAccept = (bounty: Bounty) => {
        setActiveBounty(bounty)
    }

    const handleSubmit = () => {
        setIsSubmitting(true)

        // Simulate work verifying
        setTimeout(() => {
            setIsSubmitting(false)
            setActiveBounty(null)

            // Pay user
            addCredits(activeBounty!.reward)
            addXp(activeBounty!.xp)

            // Remove from list
            setBounties(prev => prev.filter(b => b.id !== activeBounty!.id))

            // Celebration
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#fbbf24', '#f59e0b', '#10b981'] // Gold and Green
            })

        }, 2000)
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-3 mb-8">
                <Briefcase className="w-8 h-8 text-indigo-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Bounty Board</h2>
                    <p className="text-gray-400">Available Freelance Contracts</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {bounties.map((bounty) => (
                        <motion.div
                            key={bounty.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className={`relative p-6 rounded-xl border-2 backdrop-blur-sm bg-gray-900/40 transition-all cursor-pointer group ${bounty.color}`}
                            onClick={() => handleAccept(bounty)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-800 rounded-lg">
                                    <bounty.icon className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <span className={`text-xl font-bold block ${bounty.reward > 200 ? "text-yellow-400" : "text-white"}`}>
                                        ${bounty.reward}
                                    </span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Reward</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-indigo-400 transition-colors">{bounty.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                <span>{bounty.company}</span>
                                <span>•</span>
                                <span>{bounty.time}</span>
                            </div>

                            <div className="flex items-center gap-2 mt-auto">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${bounty.difficulty === "Easy" ? "bg-blue-500/20 text-blue-400" :
                                        bounty.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                                            "bg-red-500/20 text-red-400"
                                    }`}>
                                    {bounty.difficulty}
                                </span>
                                <span className="text-xs text-purple-400 font-bold">+{bounty.xp} XP</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {bounties.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500">
                        <Check className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>All contracts completed! Check back later.</p>
                    </div>
                )}
            </div>

            {/* Contract Modal */}
            <AnimatePresence>
                {activeBounty && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1e1e1e] border border-gray-700 rounded-2xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <activeBounty.icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{activeBounty.title}</h3>
                                    <p className="text-indigo-400 font-medium">{activeBounty.company}</p>
                                </div>
                            </div>

                            {/* Brief */}
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 mb-6">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mission Briefing</h4>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {activeBounty.description}
                                </p>
                            </div>

                            {/* Rewards */}
                            <div className="flex items-center justify-between mb-8 px-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Payment</p>
                                        <p className="font-bold text-white text-lg">${activeBounty.reward}</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-gray-800" />
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Shield className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Experience</p>
                                        <p className="font-bold text-white text-lg">+{activeBounty.xp} XP</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white"
                                    onClick={() => setActiveBounty(null)}
                                    disabled={isSubmitting}
                                >
                                    Decline
                                </Button>
                                <Button
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold relative overflow-hidden"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 animate-spin" />
                                            Verifying...
                                        </span>
                                    ) : "Submit Work"}

                                    {/* Loading Bar */}
                                    {isSubmitting && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-1 bg-white/50"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2 }}
                                        />
                                    )}
                                </Button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
