"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Check } from "lucide-react"
import { useProgress } from "@/lib/progress"

const STEPS = [
    {
        title: "Welcome to Xyber Shield! 🛡️",
        desc: "Your journey to becoming a master coder starts here. This dashboard is your mission control.",
        target: "body" // Centered
    },
    {
        title: "Your Mission 🚀",
        desc: "This card shows your current objective. Click 'Start Mission' to jump straight into learning.",
        target: ".focus-card" // Requires adding this class to the Focus Card
    },
    {
        title: "Track Progress 📈",
        desc: "Keep an eye on your XP and Streak here. Don't break the chain!",
        target: ".stats-header" // Requires adding this class to the Header
    },
    {
        title: "Your Path 🗺️",
        desc: "Want to see the big picture? Click 'My Path' to view your full journey map.",
        target: ".quick-path" // Requires adding this class to Quick Actions
    }
]

export function OnboardingTour() {
    const { hasSeenOnboarding, markOnboardingSeen } = useProgress()
    const [stepIndex, setStepIndex] = useState(0)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    if (hasSeenOnboarding) return null

    const step = STEPS[stepIndex]
    const isLast = stepIndex === STEPS.length - 1

    const handleNext = () => {
        if (isLast) {
            markOnboardingSeen()
        } else {
            setStepIndex(prev => prev + 1)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-md bg-card border border-primary/20 p-6 rounded-2xl shadow-2xl relative overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                Step {stepIndex + 1} of {STEPS.length}
                            </span>
                            <button
                                onClick={markOnboardingSeen}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                            {step.desc}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                                {STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === stepIndex ? "w-6 bg-primary" : "w-1.5 bg-muted"}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                {isLast ? (
                                    <>Let's Go! <Check className="w-4 h-4" /></>
                                ) : (
                                    <>Next <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
