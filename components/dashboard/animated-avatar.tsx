"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

interface BlinkingAvatarProps {
    message?: string
    className?: string
}

function BlinkingAvatar({ message, className = "w-32 h-32" }: BlinkingAvatarProps) {
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const { innerWidth, innerHeight } = window

            // Calculate position relative to center (range -1 to 1)
            const x = (clientX - innerWidth / 2) / (innerWidth / 2)
            const y = (clientY - innerHeight / 2) / (innerHeight / 2)

            setEyePosition({ x: x * 10, y: y * 5 }) // Multiplier determines movement range
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div className="relative flex flex-col items-center">
            {/* Speech Bubble */}
            {/* Speech Bubble */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute -top-20 bg-white text-zinc-900 px-6 py-3 rounded-2xl shadow-xl border-2 border-primary/20 max-w-[250px] text-center z-20 mb-3"
                >
                    <p className="font-semibold text-base">{message}</p>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-primary/20 rotate-45 transform" />
                </motion.div>
            )}

            <motion.div
                animate={{
                    y: [0, -5, 0],
                    rotate: [0, 2, -2, 0]
                }}
                transition={{
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`relative ${className}`}
                style={{
                    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
                }}
            >
                <motion.div
                    className="w-full h-full relative"
                    animate={{
                        x: eyePosition.x,
                        y: eyePosition.y
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                >
                    <Image
                        src="/robot-avatar.png"
                        alt="Robot Avatar"
                        fill
                        className="object-contain drop-shadow-xl"
                        priority
                    />
                </motion.div>
            </motion.div>
        </div>
    )
}

export default BlinkingAvatar
