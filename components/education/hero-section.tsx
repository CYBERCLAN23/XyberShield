"use client"

import { useState } from "react"
import { Search, ArrowRight, Shield, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 mb-6">
              <Shield className="w-3.5 h-3.5 text-[#22c55e]" />
              <span className="text-xs font-medium text-[#22c55e]">Cybersecurity Education</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 text-balance">
              <span className="text-foreground">Zero to </span>
              <span className="text-[#22c55e]">Cyber-Hero</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Secure your digital life with interactive courses, hands-on labs, and expert guidance.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="What do you want to learn?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#141414] border border-[#262626] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/50 transition-all"
              />
            </div>

            {/* CTA */}
            <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#22c55e] text-black font-semibold hover:bg-[#16a34a] transition-colors">
              Start Beginner Path
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[#262626]">
              {[
                { value: "50+", label: "Courses" },
                { value: "10K+", label: "Students" },
                { value: "4.9", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Image src="/logo.png" alt="XyberShield" width={48} height={48} className="rounded-xl" />
                <div>
                  <div className="font-semibold text-foreground">XyberShield Academy</div>
                  <div className="text-sm text-muted-foreground">Your security journey</div>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                {[
                  "Interactive video lessons",
                  "Hands-on security labs",
                  "Real-world scenarios",
                  "Progress tracking & XP",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-[#22c55e]" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Decorative SVG Shield */}
              <div className="mt-8 flex justify-center">
                <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
                  <path
                    d="M60 10L110 30V65C110 95 85 120 60 130C35 120 10 95 10 65V30L60 10Z"
                    stroke="#22c55e"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.3"
                  />
                  <path
                    d="M60 25L95 40V65C95 85 78 105 60 112C42 105 25 85 25 65V40L60 25Z"
                    stroke="#22c55e"
                    strokeWidth="1.5"
                    fill="#22c55e"
                    fillOpacity="0.05"
                  />
                  <path
                    d="M45 70L55 80L75 55"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg bg-[#22c55e] text-black text-xs font-semibold">
              Free to Start
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
