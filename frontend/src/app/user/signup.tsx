import type React from "react"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, User, Settings, ArrowLeft, ArrowRight } from "lucide-react"

// Dynamic imports for country/city data
import { Country, City } from 'country-state-city'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface FormData {
  // Step 1: Personal Info
  fullName: string
  email: string
  phone: string
  country: string
  city: string
  profilePhoto: FileList | null

  // Step 2: Skill Info
  availability: string
  timeSlots: string[]
  days: string[]
  skillsOffered: string[]
  skillsWanted: string[]
  isPublic: boolean
}

const timeSlots = ["Morning", "Evening"]
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const TagInput = ({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder: string
  error?: string
}) =>{
  const [input, setInput] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (input.trim() && !value.includes(input.trim())) {
        onChange([...value, input.trim()])
        setInput("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            {tag}
            <Button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-blue-600">
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [countries, setCountries] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      profilePhoto: null,
      availability: "",
      timeSlots: [],
      days: [],
      skillsOffered: [],
      skillsWanted: [],
      isPublic: false,
    },
    mode: "onChange"
  })

  const watchedCountry = watch("country")
  const watchedAvailability = watch("availability")

  // Load countries on component mount
  useEffect(() => {
    const countryData = Country.getAllCountries()
    setCountries(countryData)
  }, [])

  // Load cities when country changes
  useEffect(() => {
    if (watchedCountry) {
      const selectedCountry = countries.find(country => country.isoCode === watchedCountry)
      if (selectedCountry) {
        const cityData = City.getCitiesOfCountry(selectedCountry.isoCode)
        setCities(cityData || [])
      }
    } else {
      setCities([])
    }
    // Reset city when country changes
    setValue("city", "")
  }, [watchedCountry, countries, setValue])

  // Reset time slots and days when availability changes
  useEffect(() => {
    setValue("timeSlots", [])
    setValue("days", [])
  }, [watchedAvailability, setValue])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setValue("profilePhoto", files)
    }
  }

  const toggleTimeSlot = (slot: string, currentSlots: string[]) => {
    const newSlots = currentSlots.includes(slot)
      ? currentSlots.filter((s) => s !== slot)
      : [...currentSlots, slot]
    setValue("timeSlots", newSlots)
    trigger("timeSlots")
  }

  const toggleDay = (day: string, currentDays: string[]) => {
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day]
    setValue("days", newDays)
    trigger("days")
  }

  const handleNextStep = async () => {
    const isValid = await trigger(["fullName", "email", "phone"])
    if (isValid) {
      setCurrentStep(2)
    }
  }

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 1 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"}`}
            >
              <User className="h-4 w-4" />
            </div>
            <div className={`h-1 w-16 ${currentStep === 2 ? "bg-blue-600" : "bg-gray-200"} rounded`} />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}
            >
              <Settings className="h-4 w-4" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentStep === 1 ? "Personal Information" : "Skills & Availability"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {currentStep === 1
              ? "Tell us about yourself to get started"
              : "Share your skills and availability preferences"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <Controller
                    name="fullName"
                    control={control}
                    rules={{
                      required: "Full name is required",
                      minLength: {
                        value: 4,
                        message: "Full name must be at least 4 characters"
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="fullName"
                        placeholder="Enter your full name"
                        className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${errors.fullName ? 'border-red-500' : ''}`}
                      />
                    )}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address"
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Phone Number</Label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      validate: (value) => {
                        if (!value) return "Phone number is required"
                        return isValidPhoneNumber(value) || "Please enter a valid phone number"
                      }
                    }}
                    render={({ field }) => (
                      <div className="phone-input-container">
                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          value={field.value}
                          onChange={field.onChange}
                          className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.phone ? 'border-red-500 focus-visible:ring-red-400' : 'border-blue-200 focus-visible:ring-blue-400'}`}
                        />
                      </div>
                    )}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Country</Label>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.isoCode} value={country.isoCode}>
                                <div className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span>{country.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">City</Label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                          disabled={!watchedCountry || cities.length === 0}
                        >
                          <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                            <SelectValue placeholder={watchedCountry ? "Select city" : "Select country first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.name} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Profile Photo</Label>
                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload your profile photo
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Availability</Label>
                  <Controller
                    name="availability"
                    control={control}
                    rules={{ required: "Please select availability type" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${errors.availability ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select availability type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">By Time</SelectItem>
                          <SelectItem value="day">By Day</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.availability && (
                    <p className="text-sm text-red-500">{errors.availability.message}</p>
                  )}
                </div>

                {watchedAvailability === "time" && (
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Time Slots</Label>
                    <Controller
                      name="timeSlots"
                      control={control}
                      rules={{
                        validate: (value) => 
                          value.length > 0 || "Please select at least one time slot"
                      }}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => toggleTimeSlot(slot, field.value)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                  field.value.includes(slot)
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                          {errors.timeSlots && (
                            <p className="text-sm text-red-500">{errors.timeSlots.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}

                {watchedAvailability === "day" && (
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Available Days</Label>
                    <Controller
                      name="days"
                      control={control}
                      rules={{
                        validate: (value) => 
                          value.length > 0 || "Please select at least one day"
                      }}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {weekDays.map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(day, field.value)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                  field.value.includes(day)
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                          {errors.days && (
                            <p className="text-sm text-red-500">{errors.days.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Skills Offered</Label>
                  <Controller
                    name="skillsOffered"
                    control={control}
                    rules={{
                      validate: (value) => 
                        value.length >= 3 || "Please enter at least 3 skills offered"
                    }}
                    render={({ field }) => (
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type skills and press Enter or Space"
                        error={errors.skillsOffered?.message}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Skills Wanted</Label>
                  <Controller
                    name="skillsWanted"
                    control={control}
                    rules={{
                      validate: (value) => 
                        value.length >= 1 || "Please enter at least 1 skill wanted"
                    }}
                    render={({ field }) => (
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type skills and press Enter or Space"
                        error={errors.skillsWanted?.message}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="isPublic"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="isPublic"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    )}
                  />
                  <Label htmlFor="isPublic" className="text-gray-700 font-medium">
                    Make my profile public
                  </Label>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {currentStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}

              <div className="ml-auto">
                {currentStep === 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Complete Signup
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
