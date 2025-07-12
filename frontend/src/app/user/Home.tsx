import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SkillSwapCard }  from "@/components/skill_swap_card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search } from "lucide-react"
import { SiteHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { users } from "@/lib/utils"
import OuterNavbar from "@/components/outer_navbar"

export default function SkillSwapPlatformPage() {

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* <SiteHeader /> */}
       <OuterNavbar/>

      <main className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 sm:mb-10 items-center">
          <Select>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available Now</SelectItem>
              <SelectItem value="soon">Available Soon</SelectItem>
              <SelectItem value="any">Any</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 w-full">
            <Input type="text" placeholder="Search for skills or users..." className="w-full pr-12" />
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>

        {/* User Profiles List */}
        <div className="grid gap-6 sm:gap-8">
          {users.map((user) => (
            <SkillSwapCard key={user.id} user={user} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <Pagination>
            <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">5</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">6</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">7</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  )
}
