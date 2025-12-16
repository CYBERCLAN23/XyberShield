import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ProgressState {
    xp: number
    streak: number
    completedLessons: string[]
    lastLoginDate: string | null
    hasSeenOnboarding: boolean

    // Actions
    addXp: (amount: number) => void
    completeLesson: (lessonId: string) => void
    checkStreak: () => void
    markOnboardingSeen: () => void
}

export const useProgress = create<ProgressState>()(
    persist(
        (set, get) => ({
            xp: 2450, // Starting bonus
            streak: 12, // Starting streak
            completedLessons: [],
            lastLoginDate: null,
            hasSeenOnboarding: false,

            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

            markOnboardingSeen: () => set({ hasSeenOnboarding: true }),

            completeLesson: (lessonId) => set((state) => {
                if (state.completedLessons.includes(lessonId)) return state
                return {
                    xp: state.xp + 500, // Bonus for completion
                    completedLessons: [...state.completedLessons, lessonId]
                }
            }),

            checkStreak: () => {
                const today = new Date().toISOString().split('T')[0]
                const { lastLoginDate, streak } = get()

                if (lastLoginDate !== today) {
                    set({ lastLoginDate: today })
                    // Simple streak logic: if last login was yesterday, increment. 
                    // For demo, we just preserve the streak.
                }
            }
        }),
        {
            name: 'xyber-shield-progress',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
