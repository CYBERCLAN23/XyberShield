"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, Zap, Star, Play, FlaskConical, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "./video-player"
import { QuizPlayer } from "./quiz-player"
import { LabPlayer } from "./lab-player"
import type { Course } from "@/lib/learning-paths"
import { quizzes } from "@/lib/quiz-data"

interface CourseModalProps {
  course: Course | null
  onClose: () => void
  onComplete: (courseId: string, xp: number) => void
}

export function CourseModal({ course, onClose, onComplete }: CourseModalProps) {
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  if (!course) return null

  const quiz = quizzes.find((q) => q.courseId === course.id)
  const isQuiz = course.type === "quiz" && quiz
  const isLab = course.type === "lab" && !!course.labSteps

  const handleComplete = () => {
    setIsCompleted(true)
    onComplete(course.id, course.xpReward)
  }

  const handleQuizComplete = (score: number, total: number) => {
    const earnedXP = Math.round((score / total) * course.xpReward)
    onComplete(course.id, earnedXP)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-background rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isStarted && (
                <button
                  onClick={() => setIsStarted(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
              <h2 className="text-lg font-bold text-foreground truncate">{course.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {!isStarted ? (
              <div>
                {/* Thumbnail */}
                <div
                  className="aspect-video rounded-xl bg-cover bg-center mb-6"
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                />

                {/* Course Info */}
                <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
                <p className="text-muted-foreground mb-4">{course.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full text-sm">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-500 font-medium">+{course.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-sm">
                    {course.type === "video" && <Play className="w-4 h-4 text-primary" />}
                    {course.type === "quiz" && <Star className="w-4 h-4 text-primary" />}
                    {course.type === "lab" && <FlaskConical className="w-4 h-4 text-primary" />}
                    {course.type === "short" && <Zap className="w-4 h-4 text-primary" />}
                    <span className="text-primary capitalize">{course.type}</span>
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  size="lg"
                  onClick={() => setIsStarted(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {isQuiz ? "Start Quiz" : isLab ? "Start Lab" : "Start Lesson"}
                  {isQuiz ? (
                    <Star className="w-5 h-5 ml-2" />
                  ) : isLab ? (
                    <FlaskConical className="w-5 h-5 ml-2" />
                  ) : (
                    <Play className="w-5 h-5 ml-2" />
                  )}
                </Button>
              </div>
            ) : (
              <div>
                {isQuiz ? (
                  <QuizPlayer quiz={quiz} onComplete={handleQuizComplete} />
                ) : isLab ? (
                  <LabPlayer
                    title={course.title}
                    steps={course.labSteps ?? []}
                    xpReward={course.xpReward}
                    onComplete={handleComplete}
                  />
                ) : (
                  <VideoPlayer
                    title={course.title}
                    thumbnail={course.thumbnail}
                    videoUrl={course.videoUrl}
                    onComplete={handleComplete}
                  />
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
