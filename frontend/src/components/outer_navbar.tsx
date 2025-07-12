import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight hover:opacity-80"
        >
          Skill&nbsp;Swap&nbsp;Platform
        </Link>

        <Button
          asChild    
          variant="outline"
          className="rounded-full px-6 text-base font-medium"
        >
          <Link to="/">Home</Link>
        </Button>
      </nav>
    </header>
  );
}
