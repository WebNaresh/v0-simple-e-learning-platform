import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CourseForm from "@/components/course-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
          <CardDescription>Add a new course to your e-learning platform</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm />
        </CardContent>
      </Card>
    </div>
  )
}
