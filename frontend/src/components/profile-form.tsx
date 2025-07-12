import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, User } from "lucide-react";

// shadcn/ui Form components and react-hook-form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define a Zod schema for validation
const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not be longer than 50 characters.",
    }),
  location: z.string().optional(),
  availability: z.string().optional(),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .min(4, {
      message: "Bio must be at least 4 characters.",
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=100&width=100"
  );
  const [skillsOffered, setSkillsOffered] = useState([
    "Graphic Design",
    "Video Editing",
    "Photoshop",
  ]);
  const [skillsWanted, setSkillsWanted] = useState([
    "Python",
    "JavaScript",
    "Manager",
  ]);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");

  // Form initialization
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Marc Demo",
      location: "San Francisco, CA",
      availability: "Weekends, Evenings",
      bio: "Passionate full-stack developer looking to swap skills and learn new things!",
    },
    mode: "onChange",
  });

  // Form submission handler
  function onSubmit(data: ProfileFormValues) {
    console.log("Profile Saved:", { ...data, skillsOffered, skillsWanted });
    alert("Profile saved successfully!");
    // In a real app, you'd send this data to a backend
  }

  const handleAddSkill = (type: "offered" | "wanted") => {
    if (type === "offered" && newSkillOffered.trim() !== "") {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered("");
    } else if (type === "wanted" && newSkillWanted.trim() !== "") {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted("");
    }
  };

  const handleRemoveSkill = (
    type: "offered" | "wanted",
    skillToRemove: string
  ) => {
    if (type === "offered") {
      setSkillsOffered(
        skillsOffered.filter((skill) => skill !== skillToRemove)
      );
    } else {
      setSkillsWanted(skillsWanted.filter((skill) => skill !== skillToRemove));
    }
  };

  const handleDiscard = () => {
    // Reset form fields to default values
    form.reset();
    // Reset local state for skills
    setProfileImage("/placeholder.svg?height=100&width=100");
    setSkillsOffered(["Graphic Design", "Video Editing", "Photoshop"]);
    setSkillsWanted(["Python", "JavaScript", "Manager"]);
    setNewSkillOffered("");
    setNewSkillWanted("");
    alert("Changes discarded.");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-8 p-4 sm:p-6 bg-white rounded-xl shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40">
              <AvatarImage
                src={profileImage || "/placeholder.svg"}
                alt="Profile Photo"
              />
              <AvatarFallback className="text-4xl font-semibold">
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2 text-sm">
              <Button variant="link" className="p-0 h-auto">
                Add/Edit
              </Button>
              <Button variant="link" className="p-0 h-auto">
                Remove
              </Button>
            </div>
          </div>

          <div className="grid gap-4 flex-1 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" className="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" className="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">
                    Availability
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Weekends, Evenings"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">
                    About Me
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <Label
              htmlFor="skills-offered"
              className="font-semibold text-gray-700"
            >
              Skills Offered
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsOffered.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 rounded-full font-medium flex items-center gap-1"
                >
                  {skill}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveSkill("offered", skill)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {skill}</span>
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="skills-offered"
                placeholder="Add a skill"
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAddSkill("offered")
                }
                className="flex-1"
              />
              <Button
                type="button" // Use type="button" to prevent form submission
                onClick={() => handleAddSkill("offered")}
                className=""
              >
                Add
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="skills-wanted"
              className="font-semibold text-gray-700"
            >
              Skills Wanted
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsWanted.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 rounded-full font-medium flex items-center gap-1"
                >
                  {skill}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveSkill("wanted", skill)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {skill}</span>
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="skills-wanted"
                placeholder="Add a skill"
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill("wanted")}
                className="flex-1"
              />
              <Button
                type="button" 
                onClick={() => handleAddSkill("wanted")}
                className=""
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            className=" bg-transparent"
          >
            Discard
          </Button>
          <Button type="submit" className="">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
