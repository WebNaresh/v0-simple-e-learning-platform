import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LessonForm from "@/components/lesson-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCourseById, getLessonById } from "@/lib/actions"

interface EditLessonPageProps {
  params: {
    id: string
    lessonId: string
  }
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const course = await getCourseById(params.id)
  const lesson = await getLessonById(params.lessonId)

  if (!course || !lesson) {
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
          <CardTitle>Edit Lesson</CardTitle>
          <CardDescription>Update lesson for {course.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <LessonForm courseId={params.id} lesson={lesson} />
        </CardContent>
      </Card>
    </div>
  )
}
