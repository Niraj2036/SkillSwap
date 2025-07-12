import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface RequestSwapModalProps {
  targetUserName: string
  targetUserWantedSkills: string[]
  currentUserOfferedSkills: string[] // Assuming current user's skills are passed
}

export function RequestSwapModal({
  targetUserName,
  targetUserWantedSkills,
  currentUserOfferedSkills,
}: RequestSwapModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState("")
  const [selectedWantedSkill, setSelectedWantedSkill] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = () => {
    console.log({
      selectedOfferedSkill,
      selectedWantedSkill,
      message,
      targetUserName,
    })
    alert("Swap request submitted!")
    setOpen(false) // Close modal on submit
    //send this data to a backend
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">Request Swap</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Request Swap with {targetUserName}</DialogTitle>
          <DialogDescription>Choose the skills you want to swap and send a message.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="offered-skill">Choose one of your offered skills</Label>
            <Select onValueChange={setSelectedOfferedSkill} value={selectedOfferedSkill}>
              <SelectTrigger id="offered-skill">
                <SelectValue placeholder="Select your skill" />
              </SelectTrigger>
              <SelectContent>
                {currentUserOfferedSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wanted-skill">Choose one of their wanted skills</Label>
            <Select onValueChange={setSelectedWantedSkill} value={selectedWantedSkill}>
              <SelectTrigger id="wanted-skill">
                <SelectValue placeholder="Select their wanted skill" />
              </SelectTrigger>
              <SelectContent>
                {targetUserWantedSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}
