export interface LearningPath {
  id: string
  title: string
  description: string
  icon: string
  color: string
  totalLessons: number
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedHours: number
  topics: string[]
}

export const learningPaths: LearningPath[] = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Build modern websites and web apps from scratch",
    icon: "globe",
    color: "#38bdf8",
    totalLessons: 120,
    difficulty: "beginner",
    estimatedHours: 80,
    topics: ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    description: "Protect systems and learn ethical hacking",
    icon: "shield",
    color: "#14b8a6",
    totalLessons: 100,
    difficulty: "intermediate",
    estimatedHours: 100,
    topics: ["Network Security", "Ethical Hacking", "Cryptography", "Penetration Testing"],
  },
  {
    id: "data-science",
    title: "Data Science & AI",
    description: "Analyze data and build intelligent systems",
    icon: "brain",
    color: "#a855f7",
    totalLessons: 90,
    difficulty: "intermediate",
    estimatedHours: 120,
    topics: ["Python", "Machine Learning", "Deep Learning", "Data Visualization"],
  },
  {
    id: "mobile-dev",
    title: "Mobile Development",
    description: "Create apps for iOS and Android",
    icon: "smartphone",
    color: "#f472b6",
    totalLessons: 80,
    difficulty: "beginner",
    estimatedHours: 60,
    topics: ["React Native", "Flutter", "Mobile UI/UX", "App Store Publishing"],
  },
  {
    id: "cloud",
    title: "Cloud Computing",
    description: "Master cloud platforms and DevOps",
    icon: "cloud",
    color: "#fb923c",
    totalLessons: 70,
    difficulty: "advanced",
    estimatedHours: 90,
    topics: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Build robust APIs and server systems",
    icon: "server",
    color: "#34d399",
    totalLessons: 85,
    difficulty: "intermediate",
    estimatedHours: 70,
    topics: ["Node.js", "Databases", "REST APIs", "GraphQL", "Authentication"],
  },
  {
    id: "full-stack",
    title: "Full Stack Development",
    description: "Master both frontend and backend technologies",
    icon: "layers",
    color: "#8b5cf6",
    totalLessons: 150,
    difficulty: "advanced",
    estimatedHours: 120,
    topics: ["React", "Node.js", "PostgreSQL", "Next.js", "Redis"],
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    description: "Design beautiful and logical user interfaces",
    icon: "pen-tool",
    color: "#ec4899",
    totalLessons: 60,
    difficulty: "beginner",
    estimatedHours: 40,
    topics: ["Figma", "Color Theory", "Typography", "User Research"],
  },
]

export interface Course {
  id: string
  pathId: string
  title: string
  description: string
  thumbnail: string
  duration: string
  type: "video" | "quiz" | "lab" | "short"
  difficulty: "beginner" | "intermediate" | "advanced"
  videoUrl?: string
  labSteps?: {
    id: string
    title: string
    instruction: string
    codeSnippet?: string
    verificationCode?: string
  }[]
  xpReward: number
}

export const courses: Course[] = [
  {
    id: "html-basics",
    pathId: "web-dev",
    title: "HTML Fundamentals",
    description: "Learn the building blocks of the web",
    thumbnail: "/html-code-editor-dark-theme.jpg",
    duration: "15 min",
    type: "video",
    difficulty: "beginner",
    xpReward: 50,
  },
  {
    id: "css-styling",
    pathId: "web-dev",
    title: "CSS Styling Magic",
    description: "Make your websites beautiful",
    thumbnail: "/css-styling-colorful-web-design.jpg",
    duration: "20 min",
    type: "video",
    difficulty: "beginner",
    xpReward: 50,
  },
  {
    id: "js-intro",
    pathId: "web-dev",
    title: "JavaScript Basics",
    description: "Add interactivity to your pages",
    thumbnail: "/javascript-code-yellow-theme.jpg",
    duration: "25 min",
    type: "video",
    difficulty: "beginner",
    xpReward: 75,
  },
  {
    id: "html-quiz",
    pathId: "web-dev",
    title: "HTML Knowledge Check",
    description: "Test your HTML skills",
    thumbnail: "/quiz-game-interface.jpg",
    duration: "5 min",
    type: "quiz",
    difficulty: "beginner",
    xpReward: 100,
  },
  {
    id: "phishing-101",
    pathId: "cybersecurity",
    title: "Spot Phishing Attacks",
    description: "Learn to identify scam emails and websites",
    thumbnail: "/phishing-email-security-warning.jpg",
    duration: "12 min",
    type: "video",
    difficulty: "beginner",
    xpReward: 50,
  },
  {
    id: "password-security",
    pathId: "cybersecurity",
    title: "Strong Passwords",
    description: "Create unbreakable passwords",
    thumbnail: "/password-lock-security-digital.jpg",
    duration: "8 min",
    type: "short",
    difficulty: "beginner",
    xpReward: 30,
  },
  {
    id: "python-basics",
    pathId: "data-science",
    title: "Python for Data",
    description: "Start your data science journey",
    thumbnail: "/python-programming-snake-logo.jpg",
    duration: "30 min",
    type: "video",
    difficulty: "beginner",
    xpReward: 75,
  },
  {
    id: "react-native-intro",
    pathId: "mobile-dev",
    title: "React Native Basics",
    description: "Build your first mobile app",
    thumbnail: "/mobile-app-development-react.jpg",
    duration: "25 min",
    type: "video",
    difficulty: "beginner",
    xpReward: 75,
  },
  {
    id: "css-flexbox-lab",
    pathId: "web-dev",
    title: "Flexbox Froggy Lab",
    description: "Master CSS Flexbox layouts practically",
    thumbnail: "/css-flexbox-lab.jpg",
    duration: "20 min",
    type: "lab",
    difficulty: "intermediate",
    xpReward: 150,
    labSteps: [
      {
        id: "step1",
        title: "Justify Content",
        instruction: "Use `justify-content` to center the frog on the lilypad.",
        codeSnippet: ".pond {\n  display: flex;\n  /* Your code here */\n}",
      },
      {
        id: "step2",
        title: "Align Items",
        instruction: "Now use `align-items` to move the frog to the bottom.",
        codeSnippet: ".pond {\n  display: flex;\n  justify-content: center;\n  /* Your code here */\n}",
      },
    ],
  },
  {
    id: "react-hooks-intro",
    pathId: "web-dev",
    title: "Mastering React Hooks",
    description: "Deep dive into useState and useEffect",
    thumbnail: "/react-hooks-video.jpg",
    duration: "15 min",
    type: "video",
    difficulty: "intermediate",
    xpReward: 100,
    videoUrl: "https://www.youtube.com/embed/TNhaISOUy6Q",
  },
  {
    id: "figma-basics",
    pathId: "ui-ux",
    title: "Figma Crash Course",
    description: "Design your first app interface",
    thumbnail: "/figma-ui-design.jpg",
    duration: "45 min",
    type: "video",
    difficulty: "beginner",
    xpReward: 100,
    videoUrl: "https://www.youtube.com/embed/FTl5k5ZCj4g",
  },
  {
    id: "node-express-setup",
    pathId: "full-stack",
    title: "Express.js API Setup",
    description: "Create a basic REST API",
    thumbnail: "/nodejs-express-api.jpg",
    duration: "25 min",
    type: "lab",
    difficulty: "intermediate",
    xpReward: 125,
    labSteps: [
      {
        id: "init",
        title: "Initialize Project",
        instruction: "Run `npm init -y` to create package.json",
        codeSnippet: "npm init -y",
      },
      {
        id: "install",
        title: "Install Express",
        instruction: "Install express using npm",
        codeSnippet: "npm install express",
      },
      {
        id: "server",
        title: "Create Server",
        instruction: "Create index.js and set up a basic server",
        codeSnippet: "const express = require('express');\nconst app = express();\n\napp.listen(3000, () => console.log('Server running'));",
      },
    ],
  },
]
