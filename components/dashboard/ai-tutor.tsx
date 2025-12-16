"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Send, Sparkles, MessageSquare } from "lucide-react"

type Message = {
    role: 'user' | 'bot'
    text: string
}

const INITIAL_MESSAGES: Message[] = [
    { role: 'bot', text: "Hello, Cadet! 🛡️ I'm Xyber, your personal tutor." },
    { role: 'bot', text: "I'm here to help you solve missions without any stress. Ask me anything!" }
]

export function AiTutor() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg = input
        setMessages(prev => [...prev, { role: 'user', text: userMsg }])
        setInput("")
        setIsTyping(true)

        // Simulate AI thinking and responding
        setTimeout(() => {
            const response = generateResponse(userMsg)
            setMessages(prev => [...prev, { role: 'bot', text: response }])
            setIsTyping(false)
        }, 1500)
    }

    const generateResponse = (query: string): string => {
        const lower = query.toLowerCase()
        if (lower.includes("hint") || lower.includes("stuck")) return "Don't worry! Try breaking the problem into smaller steps. Have you checked the 'const' variable definition?"
        if (lower.includes("hello") || lower.includes("hi")) return "Greetings! Ready to learn something new today?"
        if (lower.includes("xp") || lower.includes("level")) return "You earn XP by completing lessons. Keep your streak alive to maximize your rewards!"
        return "That's a great question. While I'm in 'Offline Mode', I suggest reviewing the lesson video for clues! 🎥"
    }

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} bg-primary text-primary-foreground border-2 border-primary/20`}
            >
                <Bot className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-full max-w-sm h-[500px] flex flex-col glass rounded-2xl shadow-2xl border border-primary/20 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary/10 border-b border-primary/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Bot className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Xyber Tutor</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-muted/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 opacity-70" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-card/30"
                        >
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-muted/80 backdrop-blur-sm border border-white/5 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-card/50 border-t border-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative flex items-center"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for a hint..."
                                    className="w-full bg-muted/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
