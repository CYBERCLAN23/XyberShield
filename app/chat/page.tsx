"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Send, Sparkles, Bot, User, Code, Terminal, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import BlinkingAvatar from "@/components/dashboard/animated-avatar"

interface Message {
    id: string
    role: "user" | "ai"
    content: string
    timestamp: Date
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content: "Hello! I'm Xyber, your personal AI coding companion. I'm here to help you learn, debug, and grow. What are we working on today?",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [avatarState, setAvatarState] = useState<"idle" | "thinking" | "talking">("idle")
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, newMessage])
        setInputValue("")
        setIsTyping(true)
        setAvatarState("thinking")

        // Simulate AI response delay
        setTimeout(() => {
            setAvatarState("talking")
            const responseMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: generateResponse(newMessage.content),
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, responseMessage])
            setIsTyping(false)

            // Return to idle after "talking"
            setTimeout(() => setAvatarState("idle"), 2000)
        }, 1500)
    }

    // Simple mock response generator
    const generateResponse = (input: string): string => {
        const lowerInput = input.toLowerCase()
        if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
            return "Hi there! Ready to code something amazing?"
        }
        if (lowerInput.includes("help") || lowerInput.includes("stuck")) {
            return "Don't worry, getting stuck is part of learning! Tell me exactly what's confusing you, and we'll break it down together."
        }
        if (lowerInput.includes("javascript") || lowerInput.includes("react")) {
            return "Excellent choice! These are powerful tools for building modern web apps. Do you have a specific question about syntax or concepts?"
        }
        return "That's an interesting point! As an AI, I'm always learning too. Let's explore that concept further. Could you give me an example?"
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-card">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Bot className="w-6 h-6 text-primary" />
                        <span className="font-bold text-lg">Xyber Chat</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Online
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 z-10 container max-w-5xl mx-auto flex flex-col md:flex-row gap-6 p-4 h-[calc(100vh-80px)]">

                {/* Avatar Section (Left/Top) */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-card/30 rounded-2xl border border-border/50 backdrop-blur-sm md:w-1/3 min-h-[300px]">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse-glow" />
                        <BlinkingAvatar className="w-48 h-48 md:w-64 md:h-64" message={avatarState === "thinking" ? "Hmm..." : undefined} />
                    </div>

                    <div className="mt-6 text-center space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Xyber</h2>
                        <p className="text-muted-foreground">AI Coding Companion</p>
                        <div className="flex gap-2 justify-center mt-4">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">Mentor</span>
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium border border-amber-500/20">Debugger</span>
                        </div>
                    </div>
                </div>

                {/* Chat Section (Right/Bottom) */}
                <div className="flex-1 flex flex-col bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm shadow-xl overflow-hidden">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-primary/20" : "bg-card border border-border"}`}>
                                    {msg.role === "user" ? <User className="w-5 h-5 text-primary" /> : <Bot className="w-5 h-5 text-amber-500" />}
                                </div>

                                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-card border border-border/50 rounded-tl-none"
                                    }`}>
                                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                                    <span className="text-[10px] opacity-50 mt-1 block text-right">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="bg-card border border-border/50 p-4 rounded-2xl rounded-tl-none">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-card/80 border-t border-border backdrop-blur-sm">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                            className="flex items-center gap-2"
                        >
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Ask me anything about code..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="pr-10 h-12 bg-background/50 border-border focus:ring-primary/50 text-base"
                                />
                                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none opacity-50" />
                            </div>
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!inputValue.trim()}
                                className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                        <div className="flex gap-4 mt-3 justify-center">
                            <button className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                <Terminal className="w-3 h-3" /> Syntax Help
                            </button>
                            <button className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                <Code className="w-3 h-3" /> Code Review
                            </button>
                            <button className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                <Brain className="w-3 h-3" /> Concepts
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
