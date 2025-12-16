"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Check, X, HelpCircle, Loader2 } from "lucide-react"
import { triggerEncouragement } from "@/components/dashboard/encouragement"

const CHALLENGE = {
    question: "What is the result of '2' + 2 in JavaScript?",
    options: ["4", "'22'", "NaN", "Error"],
    answer: 1, // Index of correct answer
    explanation: "In JavaScript, the + operator concatenates strings. '2' is a string, so 2 is converted to a string, resulting in '22'."
}

export function DailyChallenge() {
    const [selected, setSelected] = useState<number | null>(null)
    const [status, setStatus] = useState<'idle' | 'checking' | 'correct' | 'wrong'>('idle')

    const handleSelect = (idx: number) => {
        if (status === 'correct') return
        setSelected(idx)
        setStatus('checking')

        // Simulate API check
        setTimeout(() => {
            if (idx === CHALLENGE.answer) {
                setStatus('correct')
                triggerEncouragement()
            } else {
                setStatus('wrong')
            }
        }, 800)
    }

    return (
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Code className="w-5 h-5" />
                </div>
                <h3 className="font-bold">Daily Bit</h3>
            </div>

            <p className="font-medium text-lg mb-4">{CHALLENGE.question}</p>

            <div className="space-y-2">
                {CHALLENGE.options.map((opt, idx) => {
                    const isSelected = selected === idx
                    let btnClass = "border-border hover:bg-muted"

                    if (isSelected && status === 'correct') btnClass = "bg-green-500/10 border-green-500 text-green-500"
                    if (isSelected && status === 'wrong') btnClass = "bg-red-500/10 border-red-500 text-red-500"
                    if (isSelected && status === 'checking') btnClass = "bg-primary/10 border-primary"

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={status !== 'idle' && status !== 'wrong'}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${btnClass}`}
                        >
                            <span>{opt}</span>
                            {isSelected && status === 'checking' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSelected && status === 'correct' && <Check className="w-4 h-4" />}
                            {isSelected && status === 'wrong' && <X className="w-4 h-4" />}
                        </button>
                    )
                })}
            </div>

            <AnimatePresence>
                {status === 'correct' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-3 bg-green-500/10 text-green-600 rounded-lg text-sm border border-green-500/20"
                    >
                        <div className="font-bold flex items-center gap-2 mb-1">
                            <Check className="w-4 h-4" /> Correct! +50 XP
                        </div>
                        {CHALLENGE.explanation}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
