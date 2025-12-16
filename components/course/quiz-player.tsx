"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, ArrowRight, Trophy, Zap, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Quiz } from "@/lib/quiz-data"

interface QuizPlayerProps {
  quiz: Quiz
  onComplete: (score: number, total: number) => void
}

export function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = quiz.questions[currentIndex]
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
  }

  const handleConfirm = () => {
    if (selectedAnswer === null) return

    setIsAnswered(true)
    if (selectedAnswer === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setShowResults(true)
      onComplete(score + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0), quiz.questions.length)
    }
  }

  const handleRetry = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setShowResults(false)
  }

  if (showResults) {
    const finalScore = score + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0)
    const percentage = Math.round((finalScore / quiz.questions.length) * 100)
    const isPassing = percentage >= 70

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border border-border p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isPassing ? "bg-emerald-500/20" : "bg-amber-500/20"
          }`}
        >
          {isPassing ? (
            <Trophy className="w-12 h-12 text-emerald-500" />
          ) : (
            <RotateCcw className="w-12 h-12 text-amber-500" />
          )}
        </motion.div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isPassing ? "Excellent Work!" : "Keep Practicing!"}
        </h2>
        <p className="text-muted-foreground mb-6">
          You scored {finalScore} out of {quiz.questions.length} ({percentage}%)
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-amber-500">+{finalScore * 20} XP</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleRetry} className="border-border bg-transparent">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Continue Learning</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Progress header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-semibold text-foreground mb-6">{currentQuestion.question}</h3>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === currentQuestion.correctIndex
                const showCorrect = isAnswered && isCorrect
                const showWrong = isAnswered && isSelected && !isCorrect

                return (
                  <motion.button
                    key={index}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      showCorrect
                        ? "border-emerald-500 bg-emerald-500/10"
                        : showWrong
                          ? "border-destructive bg-destructive/10"
                          : isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        showCorrect
                          ? "bg-emerald-500 text-white"
                          : showWrong
                            ? "bg-destructive text-white"
                            : isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {showCorrect ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : showWrong ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className="text-foreground">{option}</span>
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 rounded-xl bg-muted/50 mb-6"
                >
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Explanation: </span>
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex justify-end">
              {!isAnswered ? (
                <Button
                  onClick={handleConfirm}
                  disabled={selectedAnswer === null}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                >
                  Check Answer
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {currentIndex < quiz.questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "See Results"
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
