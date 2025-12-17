"use client"

import { motion } from "framer-motion"
import { Check, Lock, Play, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProgress } from "@/lib/progress"
import { courses } from "@/lib/learning-paths"
import { useState } from "react"
import { CourseModal } from "@/components/course/course-modal"
import { type Course } from "@/lib/learning-paths"

export function SkillTree() {
    const { completedLessons, completeLesson, addXp } = useProgress()
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

    // Sort courses or define a fixed order for the tree
    // For now, we assume the order in 'courses' array is the progression order
    const orderedCourses = courses

    const handleCourseComplete = (courseId: string, xp: number) => {
        completeLesson(courseId)
        addXp(xp)
        setSelectedCourseId(null)
    }

    // Helper to check if a course is completed (based on ID being in completedLessons)
    const isCourseCompleted = (id: string) => completedLessons.includes(id)

    return (
        <div className="relative py-10 px-4 flex flex-col items-center">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none" />

            <h2 className="text-2xl font-bold text-white mb-12 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500 fill-current" />
                Your Journey
            </h2>

            <div className="relative w-full max-w-md flex flex-col items-center gap-16">
                {/* Vertical Connecting Line */}
                <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-gray-800 -translate-x-1/2 rounded-full" />

                {orderedCourses.map((course, index) => {
                    const isCompleted = isCourseCompleted(course.id)
                    // A course is unlocked if it's the first one OR the previous one is completed
                    const isUnlocked = index === 0 || isCourseCompleted(orderedCourses[index - 1].id)
                    const isCurrent = !isCompleted && isUnlocked

                    // Determine status color/style
                    let statusColor = "bg-gray-800 border-gray-700 text-gray-500" // Locked
                    let icon = <Lock className="w-5 h-5" />

                    if (isCompleted) {
                        statusColor = "bg-emerald-900/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        icon = <Check className="w-6 h-6" />
                    } else if (isCurrent) {
                        statusColor = "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] ring-2 ring-indigo-500/20"
                        icon = <Play className="w-6 h-6 fill-current" />
                    } else if (isUnlocked) {
                        // Unlocked but not current (maybe skipped or previous completed)
                        statusColor = "bg-slate-800 border-slate-600 text-slate-300"
                        icon = <Star className="w-5 h-5" />
                    }

                    return (
                        <div key={course.id} className="relative z-10 w-full flex justify-center">

                            {/* Connector Node on Line */}
                            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${isCompleted || isCurrent ? "bg-indigo-500 border-white" : "bg-gray-800 border-gray-600"} z-0`} />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`w-full max-w-xs p-1 rounded-2xl transition-all duration-300 ${isCurrent ? "scale-105" : "hover:scale-105"}`}
                            >
                                {/* Card Content */}
                                <div
                                    onClick={() => {
                                        if (isUnlocked) setSelectedCourseId(course.id)
                                    }}
                                    className={`relative p-5 rounded-xl border ${statusColor} backdrop-blur-sm cursor-pointer flex flex-col items-center gap-3 text-center group`}
                                >
                                    {isCurrent && (
                                        <div className="absolute -top-3 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg animate-pulse">
                                            Current Mission
                                        </div>
                                    )}

                                    {/* Icon Circle */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isCompleted ? "bg-emerald-500/10 border-emerald-500" : isCurrent ? "bg-indigo-500/20 border-indigo-400" : "bg-gray-800/50 border-gray-700"}`}>
                                        {icon}
                                    </div>

                                    <div>
                                        <h3 className={`font-bold text-lg ${!isUnlocked && "blur-[2px] select-none"}`}>{course.title}</h3>
                                        <p className={`text-xs mt-1 ${isUnlocked ? "text-gray-400" : "text-gray-600 blur-[2px] select-none"}`}>
                                            {(course.labSteps?.length || 0)} Steps • {course.xpReward} XP
                                        </p>
                                    </div>

                                    {isCurrent && (
                                        <Button size="sm" className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 animate-shimmer bg-[linear-gradient(110deg,#4f46e5,45%,#6366f1,55%,#4f46e5)] bg-[length:200%_100%] transition-colors">
                                            Continue Journey
                                        </Button>
                                    )}

                                    {!isUnlocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                                            <Lock className="w-8 h-8 text-white/20" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )
                })}

                {/* Final Trophy Node */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.5)] border-4 border-yellow-200">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <span className="mt-2 text-yellow-500 font-bold text-sm tracking-widest uppercase">Mastery</span>
                </div>

            </div>

            {/* Logic to open course modal */}
            {selectedCourseId && (
                <CourseModal
                    course={courses.find(c => c.id === selectedCourseId)!}
                    onClose={() => setSelectedCourseId(null)}
                    onComplete={handleCourseComplete}
                />
            )}
        </div>
    )
}

// Helper icon
function Trophy(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}
