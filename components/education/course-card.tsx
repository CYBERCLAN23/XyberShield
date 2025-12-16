"use client"

import { useState } from "react"
import { Play, Heart, MessageCircle, Download, Clock } from "lucide-react"
import Image from "next/image"

export interface Course {
  id: string
  title: string
  thumbnail: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  type: "video" | "article" | "quiz"
  likes: number
  comments: number
  hasPdf: boolean
}

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(course.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const difficultyColors = {
    Beginner: "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20",
    Intermediate: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    Advanced: "text-red-500 bg-red-500/10 border-red-500/20",
  }

  return (
    <div className="group bg-[#141414] border border-[#262626] rounded-xl overflow-hidden hover:border-[#363636] transition-all">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[#1a1a1a]">
        <Image
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-3 rounded-full bg-[#22c55e] text-black hover:bg-[#16a34a] transition-colors">
            <Play className="w-5 h-5" fill="currentColor" />
          </button>
        </div>

        {/* Difficulty Badge */}
        <div
          className={`absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-medium border ${difficultyColors[course.difficulty]}`}
        >
          {course.difficulty}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-foreground mb-3 line-clamp-2 group-hover:text-[#22c55e] transition-colors">
          {course.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground capitalize">{course.type}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-3 border-t border-[#262626]">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
            <span>{likeCount}</span>
          </button>

          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>{course.comments}</span>
          </button>

          {course.hasPdf && (
            <button className="ml-auto text-muted-foreground hover:text-[#22c55e] transition-colors">
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
