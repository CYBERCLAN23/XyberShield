"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, X } from "lucide-react"

export function SmartHint() {
    const [isVisible, setIsVisible] = useState(false)

    // Simulation: Show hint after 10 seconds of "inactivity" or page load
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 8000)
        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="fixed bottom-24 right-6 max-w-xs z-40 bg-card border border-amber-500/30 shadow-xl rounded-2xl p-4 flex gap-4 items-start backdrop-blur-md"
            >
                <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                    <h4 className="font-bold text-sm mb-1">Stuck?</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Don't stress! You can ask the AI Tutor for a hint or check the "Resources" tab in the lesson.
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-3 h-3" />
                </button>
            </motion.div>
        </AnimatePresence>
    )
}
