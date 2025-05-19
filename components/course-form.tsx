"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCourse, updateCourse } from "@/lib/actions"
import { Loader2 } from "lucide-react"

interface CourseFormProps {
  course?: {
    _id: string
    title: string
    description: string
    instructor: string
    duration: string
  }
}

export default function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      if (course) {
        // Update existing course
        const result = await updateCourse(course._id, formData)
        if (result.success) {
          router.push(`/courses/${course._id}`)
        }
      } else {
        // Create new course
        const result = await createCourse(formData)
        if (result.success) {
          router.push(`/courses/${result.courseId}`)
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Introduction to Web Development"
          required
          defaultValue={course?.title || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="A comprehensive introduction to web development..."
          required
          rows={4}
          defaultValue={course?.description || ""}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            name="instructor"
            placeholder="John Doe"
            required
            defaultValue={course?.instructor || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" name="duration" placeholder="8 weeks" required defaultValue={course?.duration || ""} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {course ? "Updating..." : "Creating..."}
            </>
          ) : course ? (
            "Update Course"
          ) : (
            "Create Course"
          )}
        </Button>
      </div>
    </form>
  )
}
