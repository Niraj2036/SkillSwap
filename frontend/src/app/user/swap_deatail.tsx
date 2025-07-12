import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { SiteHeader } from "@/components/header"
import { RequestSwapModal } from "@/components/request_swap_modal"

import { users } from "@/lib/utils"
import { useParams } from "react-router-dom"
const currentUserSkillsOffered = ["Python", "JavaScript", "React", "Next.js"]

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const user = users.find((u) => u.id === id)

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <SiteHeader />
        <main className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">User Not Found</h2>
          <p>The profile you are looking for does not exist.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      <main className="container mx-auto px-4 py-6 sm:py-10 max-w-3xl">
        <div className="grid gap-8 p-4 sm:p-6 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 flex-shrink-0 rounded-full mx-auto md:mx-0">
              <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={`${user.name}'s profile photo`} />
              <AvatarFallback className="text-4xl font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="grid gap-4 flex-1 w-full text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{user.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-sm">
                <span className="font-semibold text-gray-700">Skills Offered:</span>
                {user.skillsOffered.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 rounded-full font-medium">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-sm">
                <span className="font-semibold text-gray-700">Skills Wanted:</span>
                {user.skillsWanted.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 rounded-full font-medium">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-lg font-semibold text-gray-700">
                <Star className="h-5 w-5" />
                <span>{user.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end mt-6">
            <RequestSwapModal
              targetUserName={user.name}
              targetUserWantedSkills={user.skillsWanted}
              currentUserOfferedSkills={currentUserSkillsOffered}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
