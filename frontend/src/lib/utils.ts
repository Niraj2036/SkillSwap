import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const users = [
  {
    id: "1",
    name: "Marc Demo",
    profileImage: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["JavaScript", "Python", "React"],
    skillsWanted: ["Photoshop", "Graphic Design"],
    rating: "3.9/5",
  },
  {
    id: "2",
    name: "Michelle Lee",
    profileImage: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["UI/UX Design", "Figma"],
    skillsWanted: ["Node.js", "Database Management"],
    rating: "4.2/5",
  },
  {
    id: "3",
    name: "Joe Wills",
    profileImage: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["Data Science", "Machine Learning"],
    skillsWanted: ["Cloud Computing", "DevOps"],
    rating: "4.0/5",
  },
  {
    id: "4",
    name: "Alice Smith",
    profileImage: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["Web Development", "HTML", "CSS"],
    skillsWanted: ["Content Writing", "SEO"],
    rating: "3.5/5",
  },
  {
    id: "5",
    name: "Bob Johnson",
    profileImage: "/placeholder.svg?height=100&width=100",
    skillsOffered: ["Video Editing", "Animation"],
    skillsWanted: ["Sound Design", "Music Production"],
    rating: "4.8/5",
  },
] 