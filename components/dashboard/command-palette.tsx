"use client"

import * as React from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { Monitor, BookOpen, User, Terminal, Code, Zap, LogOut, Check } from "lucide-react"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    // Easter Egg State
    const [matrixEffect, setMatrixEffect] = React.useState(false)

    if (matrixEffect) {
        return (
            <div
                className="fixed inset-0 z-[9999] bg-black font-mono text-green-500 p-10 overflow-hidden text-xs"
                onClick={() => setMatrixEffect(false)}
            >
                {Array.from({ length: 1000 }).map((_, i) => (
                    <span key={i} style={{ opacity: Math.random() }}>
                        {String.fromCharCode(0x30A0 + Math.random() * 96)}
                    </span>
                ))}
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-4xl font-bold bg-black px-4 text-green-500 border border-green-500 animate-pulse">
                        ACCESS GRANTED
                    </h1>
                </div>
            </div>
        )
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-lg bg-[#1e1e1e] border border-[#333] rounded-lg shadow-2xl overflow-hidden font-mono"
                onClick={(e) => e.stopPropagation()}
            >
                <Command label="Global Command Menu" className="bg-transparent">
                    <div className="flex items-center border-b border-[#333] px-3">
                        <Terminal className="w-4 h-4 text-gray-500 mr-2" />
                        <Command.Input
                            autoFocus
                            placeholder="Type a command or search..."
                            className="w-full bg-transparent text-white p-3 text-sm focus:outline-none placeholder:text-gray-600"
                        />
                        <div className="text-[10px] text-gray-600 border border-[#333] px-1.5 py-0.5 rounded">ESC</div>
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                        <Command.Empty className="py-6 text-center text-sm text-gray-500">
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Navigation" className="mb-2 text-[10px] uppercase text-gray-500 font-bold px-2">
                            <Item onSelect={() => runCommand(() => router.push("/"))} icon={Monitor}>Dashboard</Item>
                            <Item onSelect={() => runCommand(() => router.push("/playground"))} icon={Code}>Playground</Item>
                            <Item onSelect={() => runCommand(() => router.push("/chat"))} icon={Zap}>AI Tutor</Item>
                            <Item onSelect={() => runCommand(() => router.push("/profile"))} icon={User}>Profile</Item>
                        </Command.Group>

                        <Command.Group heading="System" className="mb-2 text-[10px] uppercase text-gray-500 font-bold px-2">
                            <Item onSelect={() => runCommand(() => alert("Theme switching coming soon (simulated)"))} icon={Check}>Toggle Theme</Item>
                            <Item onSelect={() => runCommand(() => setMatrixEffect(true))} icon={Terminal}>Hack Mainframe</Item>
                            <Item onSelect={() => runCommand(() => alert("Logged out (simulated)"))} icon={LogOut}>Log Out</Item>
                        </Command.Group>
                    </Command.List>

                    <div className="p-2 border-t border-[#333] bg-[#252526] text-[10px] text-gray-500 flex justify-between">
                        <span>XYBER_OS v1.0.0</span>
                        <span>CONNECTED</span>
                    </div>
                </Command>
            </div>
        </div>
    )
}

function Item({ children, icon: Icon, onSelect }: { children: React.ReactNode, icon: any, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-2 px-2 py-2 rounded text-sm text-gray-300 hover:bg-[#007fd4] hover:text-white cursor-pointer aria-selected:bg-[#007fd4] aria-selected:text-white transition-colors"
        >
            <Icon className="w-4 h-4" />
            {children}
        </Command.Item>
    )
}
