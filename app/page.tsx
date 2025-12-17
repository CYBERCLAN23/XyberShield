"use client"

import { useState, useCallback } from "react"
import { UserProvider, useUser } from "@/lib/user-context"
import { WelcomeScreen } from "@/components/onboarding/welcome-screen"
import { Header } from "@/components/dashboard/header"
import { Code } from "lucide-react"
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
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/playground" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 hover:border-indigo-500/50 transition-all">
                <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Instant Playground</h3>
                    <p className="text-sm text-muted-foreground">Experiment with code in a safe sandbox.</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="m5 12 5 5 9-9" /></svg>
                    {/* Using a code icon specifically if possible, but generic check for now or specific icon import below */}
                  </div>
                </div>
              </Link>
              {/* Daily Challenge can go here or remain in sidebar/widgets */}
            </div>

            <LearningPathsSection />
            <CourseSection />
          </div>
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
