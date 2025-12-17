"use client"

import { Certificate } from "@/components/dashboard/certificate"
import { courses } from "@/lib/learning-paths"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CertificatePage() {
    const params = useParams()
    const courseId = params.courseId as string

    let courseTitle = "Unknown Course"

    if (courseId === "mastery") {
        courseTitle = "Xyber Shield Master"
    } else {
        const foundCourse = courses.find(c => c.id === courseId)
        if (foundCourse) {
            courseTitle = foundCourse.title
        } else {
            return notFound()
        }
    }

    return (
        <div>
            {/* Back Button (Floating) */}
            <div className="fixed top-4 left-4 z-50 print:hidden">
                <Link href="/">
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>

            <Certificate
                userName="Cadet Xyber"
                courseTitle={courseTitle}
                date={new Date().toLocaleDateString()}
                courseId={courseId.substring(0, 8).toUpperCase()}
            />
        </div>
    )
}
