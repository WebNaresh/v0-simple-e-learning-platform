"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createLesson, updateLesson } from "@/lib/actions"
import { Loader2 } from "lucide-react"

interface LessonFormProps {
  courseId: string
  lesson?: {
    _id: string
    title: string
    content: string
  }
}

export default function LessonForm({ courseId, lesson }: LessonFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      if (lesson) {
        // Update existing lesson
        const result = await updateLesson(lesson._id, formData)
        if (result.success) {
          router.push(`/courses/${courseId}`)
        }
      } else {
        // Create new lesson
        const result = await createLesson(courseId, formData)
        if (result.success) {
          router.push(`/courses/${courseId}`)
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
        <Label htmlFor="title">Lesson Title</Label>
        <Input id="title" name="title" placeholder="Introduction to HTML" required defaultValue={lesson?.title || ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser..."
          required
          rows={10}
          defaultValue={lesson?.content || ""}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {lesson ? "Updating..." : "Creating..."}
            </>
          ) : lesson ? (
            "Update Lesson"
          ) : (
            "Create Lesson"
          )}
        </Button>
      </div>
    </form>
  )
}
