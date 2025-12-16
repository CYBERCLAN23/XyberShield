"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useUser } from "@/lib/user-context"
import AnimatedAvatar from "@/components/dashboard/animated-avatar"

type GuideStep = {
    message: string
    selector?: string
    position?: "top" | "bottom" | "left" | "right" | "center"
}

const guideScripts: Record<string, GuideStep[]> = {
    "home": [
        { message: "Welcome to your Dashboard! 🚀", position: "center" },
        { message: "Here is your Daily Goal. Try to hit it every day! 🎯", selector: "#daily-goal-section", position: "bottom" },
        { message: "Choose a Learning Path to start your journey. 🗺️", selector: "#learning-paths-section", position: "top" },
        { message: "These are your courses. Click one to learn! 📚", selector: "#course-section", position: "top" },
    ],
    "courses": [
        { message: "Welcome to the Course Library! 🎓", position: "center" },
        { message: "Filter courses by type here. 🔍", selector: "button:first-child", position: "bottom" }, // Heuristic
    ],
    "profile": [
        { message: "This is your Profile! 👤", position: "center" },
        { message: "Track your stats and progress here. 📈", selector: "#profile-section", position: "bottom" },
    ],
    "explore": [
        { message: "Welcome to the Leaderboard! 🏆", position: "center" },
        { message: "Compete with others and see where you rank.", position: "center" }
    ],
    "achievements": [
        { message: "Here are your Badges! 🏅", position: "center" },
        { message: "Complete lessons and challenges to earn more.", position: "center" }
    ]
}

export default function PageGuide({ activeTab }: { activeTab: string }) {
    const { user, markPageVisited } = useUser()
    const [steps, setSteps] = useState<GuideStep[]>([])
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    // Highlighting state
    const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
    const [avatarPosition, setAvatarPosition] = useState<{ top: number; left: number } | null>(null)

    useEffect(() => {
        if (!user) return

        // Use activeTab to identify the "page"
        // We prefix with "tab:" to distinguish from potentially other IDs
        const pageId = `tab:${activeTab}`
        const script = guideScripts[activeTab]
        const hasVisited = user.visitedPages?.includes(pageId) ?? false

        if (script && !hasVisited) {
            setSteps(script)
            setIsVisible(true)
            setCurrentStepIndex(0)
        }
    }, [activeTab, user])

    useEffect(() => {
        if (!isVisible || steps.length === 0) return

        const step = steps[currentStepIndex]

        // Handle Element Highlighting & Scrolling
        if (step.selector) {
            const element = document.querySelector(step.selector)
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" })
                const rect = element.getBoundingClientRect()
                setHighlightRect(rect)

                // Calculate Avatar Position relative to element
                let top = rect.bottom + 20
                let left = rect.left + rect.width / 2 - 80 // Center horizontally (assuming 160px width)

                if (step.position === "top") top = rect.top - 180
                if (step.position === "left") { left = rect.left - 180; top = rect.top + rect.height / 2 - 80 }
                if (step.position === "right") { left = rect.right + 20; top = rect.top + rect.height / 2 - 80 }

                // basic viewport checks to keep it on screen could go here, but keeping simple for now
                setAvatarPosition({ top, left })
            }
        } else {
            // Default / Center position
            setHighlightRect(null)
            setAvatarPosition(null)
        }

        const timer = setTimeout(() => {
            if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex((prev) => prev + 1)
            } else {
                const hideTimer = setTimeout(() => {
                    setIsVisible(false)
                    markPageVisited(`tab:${activeTab}`)
                }, 3000)
                return () => clearTimeout(hideTimer)
            }
        }, 4500) // Increased time slightly for readability

        return () => clearTimeout(timer)
    }, [currentStepIndex, isVisible, steps, markPageVisited, activeTab])


    if (!isVisible) return null

    // Style logic for avatar position
    const getAvatarStyle = () => {
        // If we have a target element (highlight mode)
        if (avatarPosition) {
            return {
                top: avatarPosition.top + window.scrollY,
                left: avatarPosition.left + window.scrollX,
                position: "absolute" as const
            }
        }

        // No target, check step position preference
        const position = steps[currentStepIndex]?.position

        // Center / Default (Bottom Center is safer for long text)
        if (position === "center" || !position) {
            return { bottom: "2rem", left: "50%", transform: "translateX(-50%)", position: "fixed" as const }
        }

        // Other generic positions could be added here if needed
        return { bottom: "4rem", right: "4rem", position: "fixed" as const }
    }

    return (
        <>
            {/* Dimmed Overlay */}
            <AnimatePresence>
                {isVisible && highlightRect && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, top: highlightRect.top + window.scrollY - 10, left: highlightRect.left + window.scrollX - 10, width: highlightRect.width + 20, height: highlightRect.height + 20 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute border-4 border-yellow-400 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none z-40 box-border"
                    />
                )}
            </AnimatePresence>

            {/* Avatar */}
            <div
                className="z-50 transition-all duration-700 ease-in-out pointer-events-none"
                style={getAvatarStyle()}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStepIndex}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative pointer-events-auto"
                    >
                        <AnimatedAvatar
                            message={steps[currentStepIndex].message}
                            className="w-32 h-32 md:w-40 md:h-40"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    )
}
