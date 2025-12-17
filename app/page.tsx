"use client"

import { useState, useCallback } from "react"
import { UserProvider, useUser } from "@/lib/user-context"
import { WelcomeScreen } from "@/components/onboarding/welcome-screen"
import { Header } from "@/components/dashboard/header"
import { DailyGoal } from "@/components/dashboard/daily-goal"
import { StreakCalendar } from "@/components/dashboard/streak-calendar"
import { LearningPathsSection } from "@/components/dashboard/learning-paths-section"
import { CourseSection } from "@/components/dashboard/course-section"
import { BadgesSection } from "@/components/dashboard/badges-section"
import { Leaderboard } from "@/components/dashboard/leaderboard"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { XPToast } from "@/components/dashboard/xp-toast"
import { LevelUpModal } from "@/components/dashboard/level-up-modal"
import PageGuide from "@/components/dashboard/page-guide"
import { SmartHint } from "@/components/dashboard/smart-hint"
import Link from "next/link" // Ensure Link is imported if not already, though not used in this snippet directly, good practice if needed later or verifying imports.

function AppContent() {
  const { isOnboarded, user } = useUser()
  const [activeTab, setActiveTab] = useState("home")
  const [xpToast, setXpToast] = useState({ show: false, amount: 0 })
  const [levelUp, setLevelUp] = useState({ show: false, level: 1 })

  const showXPToast = useCallback((amount: number) => {
    setXpToast({ show: true, amount })
  }, [])

  const hideXPToast = useCallback(() => {
    setXpToast((prev) => ({ ...prev, show: false }))
  }, [])

  if (!isOnboarded) {
    return <WelcomeScreen />
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <>
            <DailyGoal />
            <StreakCalendar />
            <LearningPathsSection />
            <CourseSection />
          </>
        )
      case "explore":
        return (
          <>
            <LearningPathsSection />
            <Leaderboard />
          </>
        )
      case "courses":
        return <CourseSection />
      case "achievements":
        return <BadgesSection />
      case "profile":
        return <ProfileSection />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <Header />
      <PageGuide activeTab={activeTab} />
      <SmartHint />
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <XPToast amount={xpToast.amount} show={xpToast.show} onHide={hideXPToast} />
      <LevelUpModal show={levelUp.show} level={levelUp.level} onClose={() => setLevelUp({ show: false, level: 1 })} />
    </main>
  )
}

export default function Page() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}
