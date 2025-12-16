"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Clock, BarChart3 } from "lucide-react"

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  difficulty: string
  duration: string
  category: string
}

const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]
const durations = ["All", "< 5 min", "5-15 min", "15+ min"]
const categories = ["All", "Videos", "Articles", "Quizzes"]

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    difficulty: "All",
    duration: "All",
    category: "All",
  })
  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <section className="sticky top-16 z-30 glass border-b border-[#3b82f6]/20 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* Search and Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1e293b] border border-[#3b82f6]/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border transition-all ${
                showFilters
                  ? "bg-[#3b82f6] border-[#3b82f6] text-white"
                  : "bg-[#1e293b] border-[#3b82f6]/20 text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Options */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-6 pt-2">
              {/* Difficulty */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="w-4 h-4" />
                  Difficulty
                </div>
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => updateFilter("difficulty", diff)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        filters.difficulty === diff
                          ? "bg-[#3b82f6] text-white"
                          : "bg-[#1e293b] text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Duration
                </div>
                <div className="flex gap-2">
                  {durations.map((dur) => (
                    <button
                      key={dur}
                      onClick={() => updateFilter("duration", dur)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        filters.duration === dur
                          ? "bg-[#3ddc84] text-[#0f172a]"
                          : "bg-[#1e293b] text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">Type</div>
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilter("category", cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        filters.category === cat
                          ? "bg-[#f97316] text-white"
                          : "bg-[#1e293b] text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
