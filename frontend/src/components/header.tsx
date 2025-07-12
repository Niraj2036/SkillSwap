import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn for conditional class joining

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-white shadow-md">
      <h1 className="text-2xl sm:text-3xl font-extrabold">
        Skill Swap Platform
      </h1>
      <nav className="flex items-center gap-4 sm:gap-6">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle())}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/requests">
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle())}
                >
                  Swap Requests
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button
          asChild
          variant="ghost"
          className="p-0 h-auto w-auto rounded-full"
        >
          <Link to="/profile">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="User Profile"
              />
              <AvatarFallback className="text-sm sm:text-base">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">User Profile</span>
          </Link>
        </Button>
      </nav>
    </header>
  );
}
