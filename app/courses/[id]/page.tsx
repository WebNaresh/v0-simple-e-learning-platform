import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, PlusCircle, Pencil } from "lucide-react"
import { getCourseById, getLessonsByCourseId } from "@/lib/actions"
import DeleteCourseButton from "@/components/delete-course-button"
import DeleteLessonButton from "@/components/delete-lesson-button"

interface CoursePageProps {
  params: {
    id: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseById(params.id)

  if (!course) {
    notFound()
  }

  const lessons = await getLessonsByCourseId(params.id)

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground mt-1">
            Instructor: {course.instructor} • Duration: {course.duration}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/courses/${params.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Course
            </Button>
          </Link>
          <DeleteCourseButton id={params.id} />
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Course Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{course.description}</p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lessons</h2>
        <Link href={`/courses/${params.id}/lessons/new`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Lesson
          </Button>
        </Link>
      </div>

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground mb-4">No lessons available for this course yet.</p>
            <Link href={`/courses/${params.id}/lessons/new`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Lesson
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <Card key={lesson._id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">
                    Lesson {index + 1}: {lesson.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Link href={`/courses/${params.id}/lessons/${lesson._id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <DeleteLessonButton id={lesson._id} courseId={params.id} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{lesson.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
