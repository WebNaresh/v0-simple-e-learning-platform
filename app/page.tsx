import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { getCourses } from "@/lib/actions"

export default async function Home() {
  const courses = await getCourses()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
        <Link href="/courses/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No courses available</h3>
          <p className="text-muted-foreground mt-1">Get started by creating a new course.</p>
          <Link href="/courses/new" className="mt-4 inline-block">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Course
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course._id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>Instructor: {course.instructor}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{course.description}</p>
                <p className="text-sm text-muted-foreground mt-2">Duration: {course.duration}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/courses/${course._id}`}>
                  <Button variant="outline">View Course</Button>
                </Link>
                <Link href={`/courses/${course._id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
