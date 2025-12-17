"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  name: string
  level: number
  xp: number
  streak: number
  credits: number
  badges: string[]
  completedLessons: string[]
}

interface UserContextType {
  user: User
  setUser: (user: User) => void
  addXp: (amount: number) => void
  addCredits: (amount: number) => void
  addBadge: (badge: string) => void
  completeLesson: (lessonId: string) => void
  resetProgress: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "Cadet Xyber",
    level: 1,
    xp: 0,
    streak: 1,
    credits: 0,
    badges: [],
    completedLessons: []
  })

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("xyber_user")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Ensure fields exist for backward compatibility
        if (parsed.credits === undefined) parsed.credits = 0
        if (!parsed.badges) parsed.badges = []
        if (!parsed.completedLessons) parsed.completedLessons = []
        setUser(parsed)
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }
  }, [])

  // Save to local storage whenever user changes
  useEffect(() => {
    localStorage.setItem("xyber_user", JSON.stringify(user))
  }, [user])

  const addXp = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount
      const newLevel = Math.floor(newXp / 1000) + 1
      return { ...prev, xp: newXp, level: newLevel }
    })
  }

  const addCredits = (amount: number) => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }))
  }

  const addBadge = (badge: string) => {
    setUser((prev) => {
      if (prev.badges.includes(badge)) return prev
      return { ...prev, badges: [...prev.badges, badge] }
    })
  }

  const completeLesson = (lessonId: string) => {
    setUser((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev
      return { ...prev, completedLessons: [...prev.completedLessons, lessonId] }
    })
  }

  const resetProgress = () => {
    const newUser = {
      name: "Cadet Xyber",
      level: 1,
      xp: 0,
      streak: 1,
      credits: 0,
      badges: [],
      completedLessons: []
    }
    setUser(newUser)
    localStorage.setItem("xyber_user", JSON.stringify(newUser))
    localStorage.removeItem("xyber_completed_lessons")
    window.location.reload()
  }

  return (
    <UserContext.Provider value={{ user, setUser, addXp, addCredits, addBadge, completeLesson, resetProgress }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within UserProvider")
  return context
}
