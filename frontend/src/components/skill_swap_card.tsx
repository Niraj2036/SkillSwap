import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Link } from "react-router-dom"

interface UserProfile {
  id: string
  name: string
  profileImage: string
  skillsOffered: string[]
  skillsWanted: string[]
  rating: string
}

interface SkillSwapCardProps {
  user: UserProfile
}

export function SkillSwapCard({ user }: SkillSwapCardProps) {

  return (
    <Link to={`/swap-detail/${user.id}`} className="block">
      <Card className="w-full border-none shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl">
        <CardContent className="flex flex-col md:flex-row items-start md:items-center p-4 sm:p-6 gap-4 sm:gap-6 bg-white">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-24 md:w-24 flex-shrink-0 rounded-full mx-auto md:mx-0">
            <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={`${user.name}'s profile photo`} />
            <AvatarFallback className="text-xl sm:text-2xl font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-2 flex-1 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">{user.name}</h2>
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
          </div>
          <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto mt-4 md:mt-0">
            <Button className="w-full md:w-auto pointer-events-none opacity-0">Request Swap</Button>
            <div className="flex items-center gap-1 text-lg font-semibold text-gray-700">
              <Star className="h-5 w-5" />
              <span>{user.rating}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
