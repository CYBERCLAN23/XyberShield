"use client"

import { CourseCard, type Course } from "./course-card"

const sampleCourses: Course[] = [
  {
    id: "1",
    title: "Phishing 101: Spot the Scam",
    thumbnail: "/phishing-email-scam-cybersecurity-dark.jpg",
    duration: "5 min",
    difficulty: "Beginner",
    type: "video",
    likes: 234,
    comments: 18,
    hasPdf: true,
  },
  {
    id: "2",
    title: "Password Power: Create Unbreakable Keys",
    thumbnail: "/password-security-lock-digital-dark.jpg",
    duration: "8 min",
    difficulty: "Beginner",
    type: "video",
    likes: 189,
    comments: 24,
    hasPdf: true,
  },
  {
    id: "3",
    title: "Two-Factor Authentication Essentials",
    thumbnail: "/2fa-authentication-phone-security-dark.jpg",
    duration: "4 min",
    difficulty: "Beginner",
    type: "article",
    likes: 156,
    comments: 12,
    hasPdf: false,
  },
  {
    id: "4",
    title: "Safe Public WiFi Practices",
    thumbnail: "/public-wifi-coffee-shop-security-dark.jpg",
    duration: "6 min",
    difficulty: "Beginner",
    type: "video",
    likes: 278,
    comments: 31,
    hasPdf: true,
  },
  {
    id: "5",
    title: "VPN Explained: Your Privacy Shield",
    thumbnail: "/vpn-privacy-shield-encryption-dark.jpg",
    duration: "10 min",
    difficulty: "Intermediate",
    type: "video",
    likes: 312,
    comments: 45,
    hasPdf: true,
  },
  {
    id: "6",
    title: "Social Engineering: Mind Games Hackers Play",
    thumbnail: "/social-engineering-hacker-psychology-dark.jpg",
    duration: "12 min",
    difficulty: "Intermediate",
    type: "video",
    likes: 421,
    comments: 67,
    hasPdf: true,
  },
]

export function CourseGrid() {
  return (
    <section className="py-16 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Learning Library</h2>
            <p className="text-sm text-muted-foreground">{sampleCourses.length} courses available</p>
          </div>

          {/* Filter Pills */}
          <div className="hidden md:flex items-center gap-2">
            {["All", "Beginner", "Intermediate", "Advanced"].map((filter, i) => (
              <button
                key={filter}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-[#22c55e] text-black"
                    : "bg-[#1a1a1a] text-muted-foreground hover:text-foreground hover:bg-[#262626]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
