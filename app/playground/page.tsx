"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Playground } from "@/components/dashboard/playground"

export default function PlaygroundPage() {
    return (
        <div className="h-screen w-screen bg-[#0f172a] flex flex-col overflow-hidden">
            {/* Header */}
            <header className="border-b border-[#333] bg-[#1e1e1e] p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#333]">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold text-white">Xyber Codebox</h1>
                </div>
            </header>

            {/* Fullscreen Editor */}
            <main className="flex-1 flex flex-col min-h-0">
                <Playground fullScreen={true} />
            </main>
        </div>
    )
}
