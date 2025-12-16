"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { courses, learningPaths, type Course } from "@/lib/learning-paths"
import { useUser } from "@/lib/user-context"
import { CourseModal } from "@/components/course/course-modal"
import { Play, Clock, Star, Zap, BookOpen, FlaskConical } from "lucide-react"

const typeIcons = {
  video: Play,
  quiz: Star,
  lab: FlaskConical,
  short: Zap,
}

const typeLabels = {
  video: "Video",
  quiz: "Quiz",
  lab: "Lab",
  short: "Short",
}

export function CourseSection() {
  const { user, completeLesson, updateXP } = useUser()
  const [filter, setFilter] = useState<"all" | "video" | "quiz" | "lab" | "short">("all")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const selectedPath = learningPaths.find((p) => p.id === user?.selectedPath)
  const filteredCourses = courses.filter((course) => {
    const matchesPath = !user?.selectedPath || course.pathId === user.selectedPath
    const matchesType = filter === "all" || course.type === filter
    return matchesPath && matchesType
  })

  const handleCourseComplete = (courseId: string, xp: number) => {
    completeLesson(courseId)
    updateXP(xp)
  }

  return (
    <section id="course-section" className="px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{selectedPath ? selectedPath.title : "All Courses"}</h2>
            <p className="text-sm text-muted-foreground">{filteredCourses.length} lessons available</p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          {(["all", "video", "quiz", "lab", "short"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
                }`}
            >
              {type === "all" ? "All" : typeLabels[type]}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map((course, index) => {
            const TypeIcon = typeIcons[course.type]
            const isCompleted = user?.completedLessons.includes(course.id)
            const path = learningPaths.find((p) => p.id === course.pathId)

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCourse(course)}
                className={`group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all cursor-pointer ${isCompleted ? "opacity-60" : ""
                  }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <Image
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Type badge */}
                  <div
                    className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: path?.color || "#14b8a6", color: "#0f172a" }}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {typeLabels[course.type]}
                  </div>

                  {/* XP badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/90 text-xs font-bold text-amber-950">
                    <Zap className="w-3 h-3" />+{course.xpReward} XP
                  </div>

                  {isCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <span
                      className="capitalize px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${path?.color}20`, color: path?.color }}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Course Modal */}
      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} onComplete={handleCourseComplete} />
    </section>
  )
}
