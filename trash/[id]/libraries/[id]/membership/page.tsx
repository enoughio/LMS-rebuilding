"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { Library } from "@/types/library"
import { useAuth } from "@/lib/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export default function MembershipPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const selectedPlanId = searchParams.get("plan")
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [library, setLibrary] = useState<Library | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true)
      try {
        const data = await mockLibraryService.getLibrary(id as string)
        setLibrary(data)
      } catch (error) {
        console.error("Error fetching library:", error)
        toast({
          title: "Error",
          description: "Failed to load library information",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view membership plans",
        variant: "destructive",
      })
      router.push(`/login?redirect=/libraries/${id}/membership${selectedPlanId ? `?plan=${selectedPlanId}` : ""}`)
      return
    }

    if (id) {
      fetchLibrary()
    }
  }, [id, user, router, toast, selectedPlanId])

  const handleSelectPlan = (planId: string) => {
    router.push(`/libraries/${id}/membership/buy?plan=${planId}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading membership plans...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!library) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium">Library not found</p>
            <Button variant="outline" onClick={() => router.push("/libraries")}>
              Back to Libraries
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // If a specific plan is selected, redirect to the purchase page
  if (selectedPlanId) {
    const plan = library.membershipPlans?.find((p) => p.id === selectedPlanId)
    if (plan) {
      router.push(`/libraries/${id}/membership/buy?plan=${selectedPlanId}`)
      return (
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="container flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg font-medium">Redirecting to plan purchase...</p>
            </div>
          </div>
          <Footer />
        </div>
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/libraries/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold">Membership Plans</h1>
            <p className="text-muted-foreground mt-2">
              Choose a membership plan for {library.name} to enjoy exclusive benefits and discounts
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {library?.membershipPlans?.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${
                  plan.name.includes("Premium") ? "border-primary shadow-md" : ""
                }`}
              >
                {plan.name.includes("Premium") && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.name.includes("Premium") ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Select {plan.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Membership Benefits</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Priority Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get priority access to premium seats, study rooms, and new book releases before non-members.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Discounted Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enjoy special discounted rates on seat bookings, extended hours, and additional services.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Exclusive Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access to member-only events, workshops, author meets, and networking opportunities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}
