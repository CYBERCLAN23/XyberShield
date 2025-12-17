"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ArrowRight, Terminal, RefreshCw, Trophy, Zap, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LabStep {
    id: string
    title: string
    instruction: string
    codeSnippet?: string
    verificationCode?: string
}

interface LabPlayerProps {
    title: string
    steps: LabStep[]
    xpReward: number
    onComplete: () => void
}

export function LabPlayer({ title, steps, xpReward, onComplete }: LabPlayerProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isStepComplete, setIsStepComplete] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [userCode, setUserCode] = useState("")

    const currentStep = steps[currentStepIndex]
    const progress = ((currentStepIndex + (isStepComplete ? 1 : 0)) / steps.length) * 100

    const handleVerify = () => {
        setIsVerifying(true)

        // Simulate verification delay
        setTimeout(() => {
            setIsVerifying(false)
            setIsStepComplete(true)
        }, 1500)
    }

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex((prev: number) => prev + 1)
            setIsStepComplete(false)
            setUserCode("")
        } else {
            setShowResults(true)
            onComplete()
        }
    }

    if (showResults) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl border border-border p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
                >
                    <Trophy className="w-12 h-12 text-emerald-500" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground mb-2">Lab Completed!</h2>
                <p className="text-muted-foreground mb-6">
                    You've successfully completed the {title} lab.
                </p>

                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <span className="font-bold text-amber-500">+{xpReward} XP</span>
                    </div>
                </div>

                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Continue Learning
                </Button>
            </motion.div>
        )
    }

    return (
        <div className="flex flex-col h-[600px] bg-card rounded-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded bg-primary/10">
                            <Terminal className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">{title}</h3>
                            <p className="text-xs text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</p>
                        </div>
                    </div>
                    <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary rounded-full transition-all duration-500"
                    />
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Instructions Panel */}
                <div className="w-1/3 border-r border-border p-6 overflow-y-auto bg-card">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <h4 className="text-lg font-bold mb-3 text-foreground">{currentStep.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                {currentStep.instruction}
                            </p>

                            {isStepComplete && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4"
                                >
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Success!</span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Code/Action Panel */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] items-center justify-center text-center p-8">
                    <div className="mb-6 p-6 rounded-full bg-white/5 border border-white/10">
                        <Terminal className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Code?</h3>
                    <p className="text-gray-400 max-w-md mb-8">
                        Technically, this challenge requires a full environment. Open our dedicated playground to write and test your solution freely!
                    </p>

                    <div className="flex gap-4">
                        <Link href={`/playground?lang=javascript`} target="_blank">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                <Zap className="w-4 h-4" />
                                Launch Free Playground
                            </Button>
                        </Link>
                        <Button onClick={handleNext} variant="secondary" className="gap-2">
                            Mark as Done
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
