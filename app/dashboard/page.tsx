"use client"

import { motion } from "framer-motion"
import { Flame, Trophy, Target, ArrowRight, PlayCircle, Clock, Zap } from "lucide-react"
import Link from "next/link"
import { COURSES } from "@/lib/courses"
import { useProgress } from "@/lib/progress"
import { useEffect, useState } from "react"
import { OnboardingTour } from "@/components/dashboard/onboarding-tour"
import { DailyChallenge } from "@/components/dashboard/daily-challenge"
import { AiTutor } from "@/components/dashboard/ai-tutor"
import { SmartHint } from "@/components/dashboard/smart-hint"

export default function DashboardPage() {
    // Dynamic Focus: Grab the first course and its first lesson for the demo
    const activeCourse = COURSES[0]
    const nextLesson = activeCourse.modules[0].lessons[0]

    const { xp, streak, checkStreak } = useProgress()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch for persisted state
    useEffect(() => {
        setMounted(true)
        checkStreak()
    }, [checkStreak])

    if (!mounted) return null // Or a skeleton loader

    // Fallback if data is missing
    if (!activeCourse || !nextLesson) {
        return <div className="p-8">Loading Missions...</div>
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto relative">
            <OnboardingTour />
            <AiTutor />
            <SmartHint />

            {/* Header with Minimal Stats */}
            <div className="stats-header flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Ready, Cadet? 🚀</h1>
                    <p className="text-muted-foreground text-lg">Your next mission awaits.</p>
                </div>
                <div className="flex gap-3">
                    <StatBadge icon={Flame} value={streak} label="Streak" color="text-orange-500" bg="bg-orange-500/10" border="border-orange-500/20" />
                    <StatBadge icon={Trophy} value={xp.toLocaleString()} label="XP" color="text-yellow-500" bg="bg-yellow-500/10" border="border-yellow-500/20" />
                </div>
            </div>

            {/* FOCUS CARD: The Main Event */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="focus-card relative group cursor-pointer"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative glass rounded-2xl p-8 md:p-12 flex flex-col items-center text-center space-y-6 overflow-hidden">

                    {/* Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-2">
                        <Zap className="w-4 h-4 fill-current" /> Current Objective
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
                                {nextLesson.title}
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {activeCourse.title}
                            </p>
                        </div>

                        {/* Lesson Preview: Zero Anxiety Feature */}
                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                            {["Variables", "Data Types", "Memory"].map((topic, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary/80">
                                    • {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {nextLesson.duration}</span>
                        <span className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4" /> Video Lesson</span>
                    </div>

                    <div className="pt-4">
                        <Link
                            href={`/dashboard/learn/${activeCourse.id}/${nextLesson.id}`}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] transition-all"
                        >
                            Start Mission <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Secondary: Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                    <QuickAction className="quick-path" title="My Path" icon={Target} href="/dashboard/path" />
                    <QuickAction title="Leaderboard" icon={Trophy} href="/dashboard/achievements" />
                    <QuickAction title="Settings" icon={Zap} href="/dashboard/settings" />
                    <QuickAction title="Community" icon={Flame} href="#" />
                </div>

                <div className="col-span-1">
                    <DailyChallenge />
                </div>
            </div>
        </div>
    )
}

function StatBadge({ icon: Icon, value, label, color, bg, border }: any) {
    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${bg} ${color} ${border}`}>
            <Icon className={`w-5 h-5 fill-current`} />
            <div className="flex flex-col leading-none">
                <span className="font-bold text-lg">{value}</span>
                <span className="text-[10px] opacity-80 uppercase tracking-widest">{label}</span>
            </div>
        </div>
    )
}

function QuickAction({ title, icon: Icon, href, className }: any) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl glass glass-hover group text-center ${className || ""}`}
        >
            <div className="p-3 rounded-full bg-background border border-border group-hover:border-primary group-hover:scale-110 transition-all">
                <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors">{title}</span>
        </Link>
    )
}
