"use client"

import { toast } from "sonner"
import { Sparkles } from "lucide-react"

// Call this function when a user acts (e.g., finishes a lesson)
export const triggerEncouragement = () => {
    const messages = [
        "You're doing great! Keep it up. 🚀",
        "Learning is a journey. You're making progress! 🌱",
        "Deep breath. You got this. 💎",
        "Every error is just a step towards mastery. 🛡️"
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]

    toast(randomMsg, {
        icon: <Sparkles className="w-4 h-4 text-primary" />,
        className: "glass border-primary/20 text-primary-foreground font-medium",
        duration: 4000
    })
}
