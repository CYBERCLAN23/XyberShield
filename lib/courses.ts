export const COURSES = [
    {
        id: "cyber-intro",
        title: "Introduction to Cybersecurity",
        description: "Learn the fundamentals of digital defense, hackers, and ethical hacking.",
        image: "/cybersecurity-password-lock-shield-neon.jpg",
        modules: [
            {
                id: "module-1",
                title: "The Cyber Landscape",
                lessons: [
                    { id: "lesson-1", title: "What is Cybersecurity?", duration: "5 min" },
                    { id: "lesson-2", title: "Types of Hackers", duration: "7 min" },
                    { id: "lesson-3", title: "The CIA Triad", duration: "6 min" }
                ]
            }
        ]
    },
    {
        id: "web-security",
        title: "Web Security Fundamentals",
        description: "Understand how websites are attacked and how to secure them.",
        image: "/html-code-editor-dark-theme.jpg",
        modules: [
            {
                id: "mod-web-1",
                title: "Injection Attacks",
                lessons: [
                    { id: "lesson-sql", title: "SQL Injection", duration: "10 min" },
                    { id: "lesson-xss", title: "Cross-Site Scripting (XSS)", duration: "8 min" }
                ]
            }
        ]
    },
    {
        id: "python-security",
        title: "Python for Security",
        description: "Write scripts to automate security tasks and analysis.",
        image: "/python-programming-snake-logo.jpg",
        modules: []
    }
]
