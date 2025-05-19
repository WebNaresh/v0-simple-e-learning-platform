"use server"

import { revalidatePath } from "next/cache"
import connectDB from "./db"
import Course from "@/models/course"
import Lesson from "@/models/lesson"
import mongoose from "mongoose"

// Course actions
export async function getCourses() {
  try {
    await connectDB()
    const courses = await Course.find({}).sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(courses))
  } catch (error) {
    console.error("Failed to fetch courses:", error)
    return []
  }
}

export async function getCourseById(id: string) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null
    }

    const course = await Course.findById(id)
    return course ? JSON.parse(JSON.stringify(course)) : null
  } catch (error) {
    console.error("Failed to fetch course:", error)
    return null
  }
}

export async function createCourse(formData: FormData) {
  try {
    await connectDB()

    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      instructor: formData.get("instructor") as string,
      duration: formData.get("duration") as string,
    }

    const course = await Course.create(courseData)
    revalidatePath("/")
    return { success: true, courseId: course._id }
  } catch (error) {
    console.error("Failed to create course:", error)
    return { success: false, error: "Failed to create course" }
  }
}

export async function updateCourse(id: string, formData: FormData) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid course ID" }
    }

    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      instructor: formData.get("instructor") as string,
      duration: formData.get("duration") as string,
      updatedAt: new Date(),
    }

    await Course.findByIdAndUpdate(id, courseData)
    revalidatePath(`/courses/${id}`)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update course:", error)
    return { success: false, error: "Failed to update course" }
  }
}

export async function deleteCourse(id: string) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid course ID" }
    }

    // Delete the course
    await Course.findByIdAndDelete(id)

    // Delete all lessons associated with this course
    await Lesson.deleteMany({ courseId: id })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete course:", error)
    return { success: false, error: "Failed to delete course" }
  }
}

// Lesson actions
export async function getLessonsByCourseId(courseId: string) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return []
    }

    const lessons = await Lesson.find({ courseId }).sort({ order: 1 })
    return JSON.parse(JSON.stringify(lessons))
  } catch (error) {
    console.error("Failed to fetch lessons:", error)
    return []
  }
}

export async function getLessonById(id: string) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null
    }

    const lesson = await Lesson.findById(id)
    return lesson ? JSON.parse(JSON.stringify(lesson)) : null
  } catch (error) {
    console.error("Failed to fetch lesson:", error)
    return null
  }
}

export async function createLesson(courseId: string, formData: FormData) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return { success: false, error: "Invalid course ID" }
    }

    // Get the highest order number for this course
    const highestOrderLesson = await Lesson.findOne({ courseId }).sort({ order: -1 })
    const nextOrder = highestOrderLesson ? highestOrderLesson.order + 1 : 1

    const lessonData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      courseId,
      order: nextOrder,
    }

    await Lesson.create(lessonData)
    revalidatePath(`/courses/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to create lesson:", error)
    return { success: false, error: "Failed to create lesson" }
  }
}

export async function updateLesson(id: string, formData: FormData) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid lesson ID" }
    }

    const lesson = await Lesson.findById(id)
    if (!lesson) {
      return { success: false, error: "Lesson not found" }
    }

    const lessonData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      updatedAt: new Date(),
    }

    await Lesson.findByIdAndUpdate(id, lessonData)
    revalidatePath(`/courses/${lesson.courseId}`)
    return { success: true, courseId: lesson.courseId }
  } catch (error) {
    console.error("Failed to update lesson:", error)
    return { success: false, error: "Failed to update lesson" }
  }
}

export async function deleteLesson(id: string) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Invalid lesson ID" }
    }

    const lesson = await Lesson.findById(id)
    if (!lesson) {
      return { success: false, error: "Lesson not found" }
    }

    const courseId = lesson.courseId

    await Lesson.findByIdAndDelete(id)

    // Reorder remaining lessons
    const remainingLessons = await Lesson.find({ courseId }).sort({ order: 1 })
    for (let i = 0; i < remainingLessons.length; i++) {
      await Lesson.findByIdAndUpdate(remainingLessons[i]._id, { order: i + 1 })
    }

    revalidatePath(`/courses/${courseId}`)
    return { success: true, courseId }
  } catch (error) {
    console.error("Failed to delete lesson:", error)
    return { success: false, error: "Failed to delete lesson" }
  }
}
