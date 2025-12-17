"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser, type AgeGroup } from "@/lib/user-context"
import { ChevronRight, Sparkles, Code, Shield, Brain, Rocket } from "lucide-react"

import RobotGuide from "../dashboard/animated-avatar"

const ageGroups = [
  { id: "kid" as AgeGroup, label: "8-12 years", emoji: "🎮", description: "Fun & playful learning" },
  { id: "teen" as AgeGroup, label: "13-17 years", emoji: "🚀", description: "Challenge & compete" },
  { id: "adult" as AgeGroup, label: "18+ years", emoji: "💼", description: "Efficient & focused" },
]

const avatars = [
  { id: "coder", icon: Code, color: "#38bdf8" },
  { id: "guardian", icon: Shield, color: "#14b8a6" },
  { id: "thinker", icon: Brain, color: "#a855f7" },
  { id: "explorer", icon: Rocket, color: "#fb923c" },
]

export function WelcomeScreen() {
  const { setUser } = useUser()
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState("coder")

  const handleComplete = () => {
    setUser({
      name: name || "Coder",
      ageGroup: selectedAge,
      age: null,
      avatar: selectedAvatar,
      xp: 0,
      level: 1,
      streak: 1,
      completedLessons: [],
      completedLessons: [],
      badges: ["welcome"],
      selectedPath: selectedPath,
    })
  }

  const getGuideMessage = (step: number, name: string) => {
    switch (step) {
      case 0: return "Hi! I'm Xyber. I'll be your guide!"
      case 1: return "First things first, what's your name?"
      case 2: return `Nice to meet you, ${name}! How old are you?`
      case 3: return "What do you want to learn first?"
      case 4: return "Pick a persona that fits you best!"
      default: return "Let's go!"
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="z-20 mb-8 mt-12">
        <RobotGuide message={getGuideMessage(step, name)} className="w-40 h-40" />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center max-w-md z-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              XyberShield <span className="text-primary">for Coders</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Master any tech domain. Learn at your own pace. Have fun doing it.
            </p>

            <div className="flex gap-4 mb-8">
              {[Code, Shield, Brain].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="w-12 h-12 rounded-xl bg-card flex items-center justify-center border border-border"
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => setStep(1)}
              className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Start Your Journey
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center max-w-md z-10 w-full px-4"
          >
            <Sparkles className="w-12 h-12 text-amber-400 mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">What should we call you?</h2>
            <p className="text-muted-foreground mb-6">Enter your name or nickname</p>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name..."
              className="text-center text-lg h-14 bg-card border-border mb-6 max-w-xs"
              autoFocus
            />

            <Button
              size="lg"
              onClick={() => setStep(2)}
              className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="age"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center max-w-md z-10 w-full px-4"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">Hey {name || "there"}! How old are you?</h2>
            <p className="text-muted-foreground mb-6">We'll personalize your experience</p>

            <div className="flex flex-col gap-3 w-full max-w-xs mb-6">
              {ageGroups.map((group) => (
                <motion.button
                  key={group.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAge(group.id)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${selectedAge === group.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                    }`}
                >
                  <span className="text-2xl">{group.emoji}</span>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{group.label}</p>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => setStep(3)}
              disabled={!selectedAge}
              className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="path"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center max-w-md z-10 w-full px-4"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">What interests you?</h2>
            <p className="text-muted-foreground mb-6">Choose your main focus</p>

            <div className="grid grid-cols-1 gap-3 w-full max-w-xs mb-6">
              {[
                { id: "web-dev", label: "Web Development", icon: Code, color: "#38bdf8" },
                { id: "cyber-security", label: "Cyber Security", icon: Shield, color: "#14b8a6" },
                { id: "data-science", label: "Data Science", icon: Brain, color: "#a855f7" },
              ].map((path) => (
                <motion.button
                  key={path.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPath(path.id)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${selectedPath === path.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                    }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-background"
                  >
                    <path.icon className="w-6 h-6" style={{ color: path.color }} />
                  </div>
                  <span className="font-semibold text-foreground">{path.label}</span>
                </motion.button>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => setStep(4)}
              disabled={!selectedPath}
              className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center max-w-md z-10 w-full px-4"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">Choose your avatar</h2>
            <p className="text-muted-foreground mb-6">Pick your coding persona</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {avatars.map((avatar) => {
                const Icon = avatar.icon
                return (
                  <motion.button
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedAvatar === avatar.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                      }`}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${avatar.color}20` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: avatar.color }} />
                    </div>
                    <span className="capitalize text-foreground font-medium">{avatar.id}</span>
                  </motion.button>
                )
              })}
            </div>

            <Button
              size="lg"
              onClick={handleComplete}
              className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Let's Go!
              <Rocket className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-8 flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-primary w-6" : i < step ? "bg-primary/50" : "bg-border"
              }`}
          />
        ))}
      </div>
    </div>
  )
}
