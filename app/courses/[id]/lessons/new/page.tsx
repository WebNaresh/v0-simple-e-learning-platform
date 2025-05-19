import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LessonForm from "@/components/lesson-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCourseById } from "@/lib/actions"

interface NewLessonPageProps {
  params: {
    id: string
  }
}

export default async function NewLessonPage({ params }: NewLessonPageProps) {
  const course = await getCourseById(params.id)

  if (!course) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/courses/${params.id}`} className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Course
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New Lesson</CardTitle>
          <CardDescription>Create a new lesson for {course.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <LessonForm courseId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
