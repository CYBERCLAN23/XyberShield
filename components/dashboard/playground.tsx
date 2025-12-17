"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"
import { Play, Terminal, RefreshCw, Maximize2 } from "lucide-react" // Ensure these icons are available or use alternatives
import { Button } from "@/components/ui/button"

export function Playground() {
    const [code, setCode] = useState(`// Welcome to your JS Playground!
// Try running this:

const greeting = "Hello Xyber!";
console.log(greeting);

function add(a, b) {
  return a + b;
}

console.log("2 + 3 =", add(2, 3));
`)
    const [output, setOutput] = useState<string[]>([])
    const [key, setKey] = useState(0) // Force re-render if needed

    const handleRun = () => {
        setOutput([])
        try {
            // Capture console.log
            const logs: string[] = []
            const originalLog = console.log
            console.log = (...args) => {
                logs.push(args.map(a => String(a)).join(' '))
            }

            // Execute code
            // Note: "new Function" is used here for client-side demo purposes. 
            // In a real production app with sensitive data, you'd want a sandboxed iframe or backend runner.
            new Function(code)()

            // Restore console.log and set output
            console.log = originalLog
            if (logs.length === 0) {
                setOutput(["Done (No output)"])
            } else {
                setOutput(logs)
            }
        } catch (error: any) {
            setOutput([`Error: ${error.message}`])
        }
    }

    const handleReset = () => {
        setCode(`// Welcome to your JS Playground!
// Try running this:

const greeting = "Hello Xyber!";
console.log(greeting);

function add(a, b) {
  return a + b;
}

console.log("2 + 3 =", add(2, 3));
`)
        setOutput([])
        setKey(prev => prev + 1)
    }

    return (
        <div className="w-full bg-[#1e1e1e] rounded-xl border border-[#333] shadow-2xl overflow-hidden flex flex-col h-[500px]">
            {/* Header (VS Code Style) */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#1e1e1e]">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 group">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] group-hover:brightness-75 transition" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] group-hover:brightness-75 transition" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f] group-hover:brightness-75 transition" />
                    </div>
                    <span className="ml-4 text-xs text-[#ccccc7] font-sans">playground.js</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-[#ccccc7] hover:bg-[#333] hover:text-white"
                        onClick={handleReset}
                        title="Reset Code"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-[#ccccc7] hover:bg-[#333] hover:text-white"
                        title="Maximize"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Editor Area */}
                <div className="flex-1 relative border-r border-[#333]">
                    <Editor
                        key={key}
                        height="100%"
                        defaultLanguage="javascript"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            padding: { top: 16 },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                    {/* Floating Run Button */}
                    <button
                        onClick={handleRun}
                        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-lg transition-all active:scale-95 group"
                    >
                        <Play className="w-4 h-4 fill-current group-hover:scale-110 transition" />
                        <span className="font-semibold text-sm">Run</span>
                    </button>
                </div>

                {/* Console/Output Area */}
                <div className="md:w-1/3 bg-[#1e1e1e] flex flex-col min-h-[150px]">
                    <div className="flex items-center px-4 py-2 border-b border-[#333] bg-[#252526]">
                        <Terminal className="w-4 h-4 text-[#ccccc7] mr-2" />
                        <span className="text-xs text-[#ccccc7] font-semibold uppercase tracking-wider">Console</span>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar">
                        {output.length === 0 ? (
                            <span className="text-gray-500 italic">Output will appear here...</span>
                        ) : (
                            output.map((line, i) => (
                                <div key={i} className="mb-1 text-gray-300 border-b border-[#333]/50 pb-1 last:border-0 animation-slide-up">
                                    <span className="text-green-500 mr-2">➜</span>
                                    {line}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
