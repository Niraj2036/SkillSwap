import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RequestCard } from "@/components/request_card"
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

export default function SwapRequestsPage() {
  const requests = [
    {
      id: "req1",
      name: "Marc Demo",
      profileImage: "/placeholder.svg?height=100&width=100",
      skillsOffered: ["JavaScript", "Python"],
      skillsWanted: ["Photoshop", "Graphic Design"],
      rating: "3.9/5",
      status: "Pending" as const,
    },
    {
      id: "req2",
      name: "Jane Doe",
      profileImage: "/placeholder.svg?height=100&width=100",
      skillsOffered: ["Figma", "UI/UX"],
      skillsWanted: ["React", "Node.js"],
      rating: "4.1/5",
      status: "Accepted" as const,
    },
    {
      id: "req3",
      name: "John Smith",
      profileImage: "/placeholder.svg?height=100&width=100",
      skillsOffered: ["Marketing", "SEO"],
      skillsWanted: ["Copywriting"],
      rating: "3.5/5",
      status: "Rejected" as const,
    },
    {
      id: "req4",
      name: "Emily White",
      profileImage: "/placeholder.svg?height=100&width=100",
      skillsOffered: ["Photography"],
      skillsWanted: ["Video Editing"],
      rating: "4.7/5",
      status: "Pending" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      <main className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 sm:mb-10 items-center">
          <Select defaultValue="Pending">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="All">All Requests</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 w-full">
            <Input type="text" placeholder="Search requests..." className="w-full pr-12" />
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>

        {/* Request List */}
        <div className="grid gap-6 sm:gap-8">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <Pagination>
            <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
              <PaginationItem>
                <PaginationPrevious href="#" className="" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="">
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="">
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  )
}
