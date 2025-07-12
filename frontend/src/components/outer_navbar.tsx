import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom";


const OuterNavbar= () =>{
  const location = useLocation();

  return (
    <nav className="w-100vw position-sticky top-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Platform Name */}
        <h1 className="text-lg font-medium text-gray-800">Skill Swap Platform</h1>

        {/* Home Button */}
        <Link
        to={location.pathname === "/" ? "/login" : "/"}>
        <Button
          // onClick={""}
          variant="outline"
          className="rounded-full px-6 py-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
        >
         {location.pathname === "/" ? "Login" : "Home"}
        </Button>
        </Link>
      </div>
    </nav>
  )
}

export default OuterNavbar
