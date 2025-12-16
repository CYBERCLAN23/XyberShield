export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirement: string
  category: "achievement" | "streak" | "mastery" | "special"
}

export const badges: Badge[] = [
  {
    id: "welcome",
    name: "Welcome Aboard",
    description: "Started your learning journey",
    icon: "rocket",
    color: "#14b8a6",
    requirement: "Complete onboarding",
    category: "special",
  },
  {
    id: "first-lesson",
    name: "First Steps",
    description: "Completed your first lesson",
    icon: "play",
    color: "#38bdf8",
    requirement: "Complete 1 lesson",
    category: "achievement",
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Aced a quiz with 100% score",
    icon: "star",
    color: "#fbbf24",
    requirement: "Get 100% on any quiz",
    category: "mastery",
  },
  {
    id: "streak-3",
    name: "On Fire",
    description: "Maintained a 3-day streak",
    icon: "flame",
    color: "#fb923c",
    requirement: "3 day streak",
    category: "streak",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintained a 7-day streak",
    icon: "flame",
    color: "#ef4444",
    requirement: "7 day streak",
    category: "streak",
  },
  {
    id: "streak-30",
    name: "Unstoppable",
    description: "Maintained a 30-day streak",
    icon: "flame",
    color: "#a855f7",
    requirement: "30 day streak",
    category: "streak",
  },
  {
    id: "level-5",
    name: "Rising Star",
    description: "Reached Level 5",
    icon: "trending-up",
    color: "#34d399",
    requirement: "Reach Level 5",
    category: "achievement",
  },
  {
    id: "level-10",
    name: "Expert Learner",
    description: "Reached Level 10",
    icon: "award",
    color: "#f472b6",
    requirement: "Reach Level 10",
    category: "achievement",
  },
  {
    id: "web-beginner",
    name: "Web Rookie",
    description: "Completed 5 Web Dev lessons",
    icon: "globe",
    color: "#38bdf8",
    requirement: "5 Web Dev lessons",
    category: "mastery",
  },
  {
    id: "security-beginner",
    name: "Security Aware",
    description: "Completed 5 Cybersecurity lessons",
    icon: "shield",
    color: "#14b8a6",
    requirement: "5 Cybersecurity lessons",
    category: "mastery",
  },
  {
    id: "xp-1000",
    name: "XP Hunter",
    description: "Earned 1,000 XP",
    icon: "zap",
    color: "#fbbf24",
    requirement: "Earn 1,000 XP",
    category: "achievement",
  },
  {
    id: "xp-5000",
    name: "XP Champion",
    description: "Earned 5,000 XP",
    icon: "trophy",
    color: "#f59e0b",
    requirement: "Earn 5,000 XP",
    category: "achievement",
  },
]
