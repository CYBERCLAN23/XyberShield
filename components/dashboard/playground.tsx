"use client"

import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Play, Terminal, RefreshCw, Maximize2, Files, Search, Box, Settings, X, ChevronDown, Rocket, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type Language = "javascript" | "typescript" | "python" | "html" | "css" | "json" | "sql"
type Theme = "vs-dark" | "light"

interface Extension {
    id: string
    name: string
    description: string
    icon: any
    version: string
    installed: boolean
}

const defaultCode: Record<Language, string> = {
    javascript: `// Welcome to your JS Playground!
// Try running this:

const greeting = "Hello Xyber!";
console.log(greeting);

function add(a, b) {
  return a + b;
}

console.log("2 + 3 =", add(2, 3));
`,
    typescript: `// TypeScript Playground
interface User {
  id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: "Xyber",
};

console.log(\`User: \${user.name}\`);
`,
    python: `# Python Playground
def greet(name):
    return f"Hello, {name}!"

print(greet("Xyber"))
`,
    html: `<!-- HTML Playground -->
<div id="app">
  <h1>Hello Xyber</h1>
</div>
`,
    css: `/* CSS Playground */
body {
  background: #0f172a;
  color: white;
}
`,
    json: `{
  "name": "Xyber Shield",
  "version": "1.0.0"
}`,
    sql: `-- SQL Playground
SELECT * FROM users WHERE role = 'student';
`
}

export function Playground({ fullScreen = false, initialLanguage = "javascript" }: { fullScreen?: boolean, initialLanguage?: string }) {
    const [language, setLanguage] = useState<Language>(initialLanguage as Language)
    const [code, setCode] = useState(defaultCode[initialLanguage as Language] || defaultCode.javascript)
    const [theme, setTheme] = useState<Theme>("vs-dark")
    const [activeSidebar, setActiveSidebar] = useState<"explorer" | "search" | "extensions" | null>(null)
    const [output, setOutput] = useState<string[]>([])
    const [key, setKey] = useState(0)

    // Mock Extensions
    const [extensions, setExtensions] = useState<Extension[]>([
        { id: "prettier", name: "Prettier", description: "Code formatter", icon: Check, version: "3.0.0", installed: true },
        { id: "dracula", name: "Dracula Theme", description: "Official Dracula Theme", icon: Rocket, version: "2.24.2", installed: false },
        { id: "python-pack", name: "Python", description: "IntelliSense for Python", icon: Files, version: "2023.4.0", installed: false },
        { id: "live-server", name: "Live Server", description: "Launch local server", icon: RefreshCw, version: "5.7.9", installed: false },
    ])

    // Update code when language changes manually
    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang)
        setCode(defaultCode[lang])
    }

    const toggleExtension = (id: string) => {
        setExtensions(prev => prev.map(ext =>
            ext.id === id ? { ...ext, installed: !ext.installed } : ext
        ))
    }

    const handleRun = () => {
        setOutput([])
        if (language !== "javascript" && language !== "typescript") {
            setOutput(["Running non-JS code in browser is simulated:", "---", "Execution Success (Simulated Output)"])
            return
        }

        try {
            const logs: string[] = []
            const originalLog = console.log
            console.log = (...args) => {
                logs.push(args.map(a => String(a)).join(' '))
            }

            // Very unsafe eval for demo only
            // eslint-disable-next-line no-new-func
            new Function(code.replace(/import\s+.*;/g, ""))()

            console.log = originalLog
            if (logs.length === 0) setOutput(["Done (No output)"])
            else setOutput(logs)
        } catch (error: any) {
            setOutput([`Error: ${error.message}`])
        }
    }

    return (
        <div className={`w-full bg-[#1e1e1e] overflow-hidden flex ${fullScreen ? "h-full rounded-none border-0 shadow-none" : "h-[600px] rounded-xl border border-[#333] shadow-2xl"}`}>

            {/* Activity Bar (Left) */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-4 border-r border-[#1e1e1e] shrink-0">
                <button
                    onClick={() => setActiveSidebar(activeSidebar === "explorer" ? null : "explorer")}
                    className={`p-2 rounded-lg transition-colors ${activeSidebar === "explorer" ? "text-white bg-white/10" : "text-[#858585] hover:text-white"}`}
                >
                    <Files className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setActiveSidebar(activeSidebar === "search" ? null : "search")}
                    className={`p-2 rounded-lg transition-colors ${activeSidebar === "search" ? "text-white bg-white/10" : "text-[#858585] hover:text-white"}`}
                >
                    <Search className="w-6 h-6" />
                </button>
                <div className="h-px w-8 bg-white/10 my-2" />
                <button
                    onClick={() => setActiveSidebar(activeSidebar === "extensions" ? null : "extensions")}
                    className={`p-2 rounded-lg transition-colors ${activeSidebar === "extensions" ? "text-white bg-white/10" : "text-[#858585] hover:text-white"}`}
                >
                    <Box className="w-6 h-6" />
                </button>
                <div className="mt-auto">
                    <button className="p-2 text-[#858585] hover:text-white transition-colors">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Sidebar Panel (Collapsible) */}
            {activeSidebar && (
                <div className="w-64 bg-[#252526] border-r border-[#1e1e1e] text-white flex flex-col shrink-0">
                    <div className="p-3 text-xs font-bold uppercase tracking-wider text-[#bbbbbb] flex justify-between items-center">
                        {activeSidebar}
                        <button onClick={() => setActiveSidebar(null)} className="hover:text-white"><X className="w-3 h-3" /></button>
                    </div>

                    {activeSidebar === "extensions" && (
                        <div className="flex-1 overflow-y-auto p-2">
                            <input type="text" placeholder="Search Extensions" className="w-full bg-[#3c3c3c] border-none text-white text-sm px-3 py-1 rounded-sm mb-4 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#007fd4]" />
                            <div className="space-y-1">
                                {extensions.map(ext => (
                                    <div key={ext.id} className="flex gap-3 p-2 rounded hover:bg-[#2a2d2e] group cursor-pointer">
                                        <div className="w-8 h-8 bg-[#3c3c3c] flex items-center justify-center rounded shrink-0">
                                            <ext.icon className="w-5 h-5 text-[#007fd4]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-sm truncate">{ext.name}</span>
                                                <span className="text-[10px] text-gray-500">{ext.version}</span>
                                            </div>
                                            <p className="text-xs text-[#cccccc] truncate mb-2">{ext.description}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleExtension(ext.id)}
                                                    className={`px-2 py-0.5 text-[11px] rounded transition-colors ${ext.installed ? "bg-[#3c3c3c] text-white" : "bg-[#007fd4] text-white hover:bg-[#006ab1]"}`}
                                                >
                                                    {ext.installed ? "Uninstall" : "Install"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSidebar !== "extensions" && (
                        <div className="flex-1 flex items-center justify-center text-sm text-gray-500 italic">
                            Empty View
                        </div>
                    )}
                </div>
            )}

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Editor Tabs / Header */}
                <div className="h-9 bg-[#2d2d2d] flex items-center px-4 justify-between select-none">
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] rounded-t-sm h-full text-sm text-[#e7e7e7] border-t border-[#007fd4]">
                        <span className="text-[#e7c927]">JS</span>
                        <span>playground.{language === "javascript" ? "js" : language === "typescript" ? "ts" : language === "python" ? "py" : "txt"}</span>
                        <X className="w-3 h-3 ml-2 text-gray-400 hover:text-white cursor-pointer" />
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value as Language)}
                            className="bg-transparent text-xs text-[#cccccc] focus:outline-none cursor-pointer hover:text-white"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="python">Python</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="sql">SQL</option>
                        </select>

                        <button onClick={handleRun} className="flex items-center gap-1 text-green-500 hover:text-green-400">
                            <Play className="w-3 h-3 fill-current" />
                            <span className="text-xs font-bold uppercase">Run</span>
                        </button>
                    </div>
                </div>

                {/* Editor + Terminal Split */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 relative">
                        <Editor
                            key={key}
                            height="100%"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            theme={theme}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Simulated Terminal */}
                    <div className="h-1/3 bg-[#1e1e1e] border-t border-[#333] flex flex-col">
                        <div className="h-8 flex items-center px-4 gap-4 border-b border-[#2b2b2b]">
                            <div className="text-xs uppercase font-bold text-white border-b border-white py-2">Output</div>
                            <div className="text-xs uppercase font-bold text-gray-500 hover:text-gray-300 cursor-pointer">Terminal</div>
                            <div className="text-xs uppercase font-bold text-gray-500 hover:text-gray-300 cursor-pointer">Problems</div>
                        </div>
                        <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar">
                            {output.length === 0 ? (
                                <span className="text-gray-600">Click Run to see output...</span>
                            ) : (
                                output.map((line, i) => (
                                    <div key={i} className="mb-1 text-gray-300">
                                        <span className="text-green-500 mr-2">➜</span>
                                        {line}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#007fd4] text-white text-[10px] flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded">
                        <Rocket className="w-3 h-3" />
                        <span>master*</span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded">
                        <RefreshCw className="w-3 h-3" />
                        <span>0</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="cursor-pointer hover:bg-white/20 px-1 rounded">Ln 12, Col 43</span>
                    <span className="cursor-pointer hover:bg-white/20 px-1 rounded">UTF-8</span>
                    <span className="cursor-pointer hover:bg-white/20 px-1 rounded uppercase">{language}</span>
                    <span className="cursor-pointer hover:bg-white/20 px-1 rounded">Prettier</span>
                </div>
            </div>
        </div>
    )
}
