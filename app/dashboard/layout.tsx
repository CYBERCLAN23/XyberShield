import Link from "next/link"
import { Boxes, LayoutDashboard, Map, Settings, Trophy, LogOut } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl hidden md:flex flex-col fixed inset-y-0">
                <div className="p-6 border-b border-border">
                    <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <span className="text-primary">X</span>
                        </div>
                        XyberShield
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem href="/dashboard" icon={LayoutDashboard} label="Mission Control" />
                    <NavItem href="/dashboard/path" icon={Map} label="My Path" />
                    <NavItem href="/dashboard/achievements" icon={Trophy} label="Trophies" />
                    <NavItem href="/dashboard/settings" icon={Settings} label="Settings" />
                </nav>

                <div className="p-4 border-t border-border">
                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, icon: Icon, label }: any) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    )
}
