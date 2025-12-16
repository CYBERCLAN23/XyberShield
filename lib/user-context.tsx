"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type AgeGroup = "kid" | "teen" | "adult" | null

export interface UserProfile {
  name: string
  ageGroup: AgeGroup
  age: number | null
  avatar: string
  xp: number
  level: number
  streak: number
  completedLessons: string[]
  badges: string[]
  selectedPath: string | null
  visitedPages: string[]
}

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isOnboarded: boolean
  updateXP: (amount: number) => void
  addBadge: (badge: string) => void
  completeLesson: (lessonId: string) => void
  markPageVisited: (page: string) => void
}

const defaultUser: UserProfile = {
  name: "",
  ageGroup: null,
  age: null,
  avatar: "default",
  xp: 0,
  level: 1,
  streak: 0,
  completedLessons: [],
  badges: [],
  selectedPath: null,
  visitedPages: [],
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isOnboarded, setIsOnboarded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("xyber-user")
    if (stored) {
      const parsed = JSON.parse(stored)
      // Ensure visitedPages exists for old data
      if (!parsed.visitedPages) parsed.visitedPages = []
      setUser(parsed)
      setIsOnboarded(!!parsed.ageGroup)
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("xyber-user", JSON.stringify(user))
      setIsOnboarded(!!user.ageGroup)
    }
  }, [user])

  const updateXP = (amount: number) => {
    if (!user) return
    const newXP = user.xp + amount
    const xpPerLevel = 500
    const newLevel = Math.floor(newXP / xpPerLevel) + 1
    setUser({ ...user, xp: newXP, level: newLevel })
  }

  const addBadge = (badge: string) => {
    if (!user || user.badges.includes(badge)) return
    setUser({ ...user, badges: [...user.badges, badge] })
  }

  const completeLesson = (lessonId: string) => {
    if (!user || user.completedLessons.includes(lessonId)) return
    setUser({ ...user, completedLessons: [...user.completedLessons, lessonId] })
    updateXP(50)
  }

  const markPageVisited = (page: string) => {
    if (!user) return
    const currentVisited = user.visitedPages || []
    if (currentVisited.includes(page)) return
    setUser({ ...user, visitedPages: [...currentVisited, page] })
  }

  return (
    <UserContext.Provider value={{ user, setUser, isOnboarded, updateXP, addBadge, completeLesson, markPageVisited }}>
      {children}
    </UserContext.Provider>
  )
}



export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within UserProvider")
  return context
}
