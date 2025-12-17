"use client"

import { Check, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CertificateProps {
    userName: string
    courseTitle: string
    date: string
    courseId: string
}

export function Certificate({ userName, courseTitle, date, courseId }: CertificateProps) {

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#0f172a] print:bg-white print:p-0">

            {/* Action Bar (Hide on Print) */}
            <div className="mb-8 print:hidden flex items-center gap-4">
                <Button onClick={handlePrint} className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                    Download / Print PDF
                </Button>
            </div>

            {/* Certificate Frame */}
            <div className="relative w-[1123px] h-[794px] bg-white text-black p-12 shadow-2xl print:shadow-none print:w-full print:h-full overflow-hidden flex flex-col justify-between border-[1px] border-teal-500/30 rounded-lg">

                {/* Outer Teal Border (Card style) */}
                <div className="absolute inset-0 m-2 border-[2px] border-teal-500 rounded-lg pointer-events-none" />

                {/* Header */}
                <div className="flex items-start justify-between z-10 p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-teal-600 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-teal-600 fill-current" />
                        </div>
                        <h1 className="text-xl font-bold tracking-widest text-teal-900 uppercase font-sans">
                            Xyber Shield Institute
                        </h1>
                    </div>
                    <div className="text-xs font-mono text-gray-400">
                        ID: {courseId}
                    </div>
                </div>

                {/* Body */}
                <div className="z-10 flex-1 flex flex-col items-center justify-center text-center -mt-10">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
                        This certifies that
                    </p>

                    <h2 className="text-6xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
                        {userName}
                    </h2>

                    <p className="text-gray-500 text-lg mb-8">
                        Has successfully completed the requirements to be recognized as a
                    </p>

                    <h3 className="text-4xl font-bold text-teal-600 tracking-tight">
                        {courseTitle}
                    </h3>
                </div>

                {/* Footer */}
                <div className="w-full flex justify-between items-end px-12 pb-8 z-10">
                    {/* Signature */}
                    <div className="text-left">
                        <div className="relative mb-2 w-48 h-12">
                            {/* Simulated Signature */}
                            <svg viewBox="0 0 200 50" className="absolute bottom-0 left-0 w-full h-full text-slate-800">
                                <path d="M10,40 C30,10 50,50 80,30 S120,40 150,20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="border-t border-gray-300 w-48 pt-2">
                            <p className="text-sm font-bold text-teal-900 uppercase">Cedrick Yempo</p>
                            <p className="text-[10px] text-teal-600 uppercase tracking-wider">Chief Education Officer</p>
                        </div>
                    </div>

                    {/* Seal */}
                    <div className="relative w-24 h-24">
                        {/* Dashed Circle */}
                        <div className="absolute inset-0 border-2 border-dashed border-yellow-400 rounded-full opacity-50 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-2 border border-yellow-400 rounded-full flex items-center justify-center">
                            <Award className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
