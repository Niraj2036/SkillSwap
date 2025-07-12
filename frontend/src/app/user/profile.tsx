import { ProfileForm } from "@/components/profile-form"
import { SiteHeader } from "@/components/Header"

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      <main className="container mx-auto px-4 py-6 sm:py-10 max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your Profile</h2>
        <ProfileForm />
      </main>
    </div>
  )
}
