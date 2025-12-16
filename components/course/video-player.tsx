"use client"

import { useState, useRef, useEffect, type MouseEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, Smartphone } from "lucide-react"

interface VideoPlayerProps {
  title: string
  thumbnail: string
  videoUrl?: string
  onComplete: () => void
}

export function VideoPlayer({ title, thumbnail, videoUrl, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isPortrait, setIsPortrait] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // If we have a real video URL, we assume it's a YouTube embed for now
  const isYouTube = videoUrl?.includes("youtube") || videoUrl?.includes("youtu.be")

  // Check orientation
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768
      const isPortraitMode = window.matchMedia("(orientation: portrait)").matches
      setIsPortrait(isMobile && isPortraitMode)
    }

    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    return () => window.removeEventListener("resize", checkOrientation)
  }, [])

  // Auto-fullscreen on play
  const handlePlay = () => {
    setIsPlaying(true)
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => console.log("Fullscreen blocked", err))
      }
    }
  }

  // Simulate video playback if NOT YouTube
  useEffect(() => {
    if (isPlaying && !isYouTube) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 100
          }
          return prev + 0.5
        })
      }, 100)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, isYouTube])

  // Handle completion when progress reaches 100
  useEffect(() => {
    if (progress >= 100) {
      onComplete()
    }
  }, [progress, onComplete])

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying) {
      const timeout = setTimeout(() => setShowControls(false), 3000)
      return () => clearTimeout(timeout)
    }
  }, [isPlaying, showControls])

  const formatTime = (percent: number) => {
    const totalSeconds = Math.floor((percent / 100) * 300) // Assume 5 min video
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isYouTube && videoUrl) {
    return (
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <iframe
          width="100%"
          height="100%"
          src={`${videoUrl}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
          onLoad={() => {
            // For YouTube, we can't easily track progress without the API, 
            // so we'll just mark complete after a timeout or let user manually complete
            setTimeout(onComplete, 30000) // Auto-complete after 30s for demo
          }}
        />
        {/* Helper for demo - manual complete button if needed */}
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={onComplete}
            className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary transition-colors"
          >
            Mark Complete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-2xl overflow-hidden group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video thumbnail/placeholder */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${thumbnail})`, filter: isPlaying ? "none" : "brightness(0.7)" }}
      />

      {/* Portrait Mode Warning Overlay */}
      <AnimatePresence>
        {isPortrait && isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-8 text-center"
          >
            <Smartphone className="w-16 h-16 text-primary mb-4 animate-pulse" />
            <h3 className="text-white text-xl font-bold mb-2">Please Rotate Your Phone</h3>
            <p className="text-white/70">For the best experience, please watch this video in landscape mode.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play overlay when paused */}
      <AnimatePresence>
        {!isPlaying && progress === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
            </div>

            {/* Center controls */}
            <div className="absolute inset-0 flex items-center justify-center gap-8">
              <button
                onClick={() => setProgress(Math.max(0, progress - 10))}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <SkipBack className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={() => isPlaying ? setIsPlaying(false) : handlePlay()}
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                )}
              </button>

              <button
                onClick={() => setProgress(Math.min(100, progress + 10))}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <SkipForward className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress bar */}
              <div className="mb-3">
                <div
                  className="h-1 bg-white/30 rounded-full cursor-pointer"
                  onClick={(e: MouseEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const percent = ((e.clientX - rect.left) / rect.width) * 100
                    setProgress(percent)
                  }}
                >
                  <div className="h-full bg-primary rounded-full relative" style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-white text-sm">
                    {formatTime(progress)} / {formatTime(100)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    <Settings className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      if (containerRef.current) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen()
                        } else {
                          containerRef.current.requestFullscreen()
                        }
                      }
                    }}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Maximize className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion overlay */}
      <AnimatePresence>
        {progress >= 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4"
              >
                <Play className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-white text-xl font-bold mb-2">Lesson Complete!</h3>
              <p className="text-white/70">You earned XP for this lesson</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
