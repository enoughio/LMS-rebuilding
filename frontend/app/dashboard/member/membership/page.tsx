"use client"

import { useState, useEffect } from "react"
import { Check, CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { MembershipPlan } from "@/types/user"
import type { Library } from "@/types/library"

export default function MembershipPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [libraries, setLibraries] = useState<Library[]>([])
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true)
      try {
        const librariesData = await mockLibraryService.getLibraries()
        setLibraries(librariesData)

        // If user has a membership, select that library by default
        if (user?.membership?.planId) {
          const userLibrary = librariesData.find((lib) =>
            lib.membershipPlans.some((plan) => plan.id === user.membership?.planId),
          )
          if (userLibrary) {
            setSelectedLibrary(userLibrary.id)
          } else if (librariesData.length > 0) {
            setSelectedLibrary(librariesData[0].id)
          }
        } else if (librariesData.length > 0) {
          setSelectedLibrary(librariesData[0].id)
        }
      } catch (error) {
        console.error("Error fetching libraries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLibraries()
  }, [user])

  const handleLibraryChange = (libraryId: string) => {
    setSelectedLibrary(libraryId)
    setSelectedPlan(null)
  }

  const handlePlanSelect = (plan: MembershipPlan) => {
    setSelectedPlan(plan)
  }

  const handlePurchase = async () => {
    if (!selectedPlan) return

    setProcessingPayment(true)

    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Membership Purchased",
        description: `You have successfully purchased the ${selectedPlan.name} plan.`,
      })

      // In a real app, we would update the user's membership status
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingPayment(false)
    }
  }

  const getLibraryPlans = (libraryId: string) => {
    const library = libraries.find((lib) => lib.id === libraryId)
    return library ? library.membershipPlans : []
  }

  const isPlanActive = (plan: MembershipPlan) => {
    return user?.membership?.planId === plan.id && user?.membership?.status === "active"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Membership Plans</h1>
        <p className="text-muted-foreground">Choose a membership plan that suits your needs</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading membership plans...</p>
          </div>
        </div>
      ) : (
        <>
          {user?.membership?.status === "active" && (
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Current Membership</h3>
                    <p className="text-muted-foreground">You are currently on the {user.membership.planName} plan</p>
                    <p className="text-sm text-muted-foreground">
                      Expires on {new Date(user.membership.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="default" className="w-fit">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue={selectedLibrary || ""} onValueChange={handleLibraryChange}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Select a Library</h2>
              <p className="text-sm text-muted-foreground">Choose a library to view its membership plans</p>
            </div>

            <TabsList className="mb-4">
              {libraries.map((library) => (
                <TabsTrigger key={library.id} value={library.id}>
                  {library.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {libraries.map((library) => (
              <TabsContent key={library.id} value={library.id} className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {library.membershipPlans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`${selectedPlan?.id === plan.id ? "border-primary" : ""} ${isPlanActive(plan) ? "bg-muted/50" : ""}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{plan.name}</CardTitle>
                          {isPlanActive(plan) && <Badge variant="default">Current Plan</Badge>}
                        </div>
                        <CardDescription>{plan.duration} days membership</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold">₹{plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>

                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => handlePlanSelect(plan)}
                          variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                          disabled={isPlanActive(plan)}
                        >
                          {isPlanActive(plan)
                            ? "Current Plan"
                            : selectedPlan?.id === plan.id
                              ? "Selected"
                              : "Select Plan"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {selectedPlan && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Payment Details</CardTitle>
                      <CardDescription>Complete your membership purchase</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{selectedPlan.name} Plan</h3>
                            <p className="text-sm text-muted-foreground">
                              {library.name} - {selectedPlan.duration} days membership
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{selectedPlan.price}</p>
                            <p className="text-xs text-muted-foreground">
                              Valid until{" "}
                              {new Date(Date.now() + selectedPlan.duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Payment Method</h3>
                        <div className="flex items-center gap-2 rounded-lg border p-4">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <span>Credit/Debit Card</span>
                        </div>
                      </div>

                      {/* In a real app, we would have a payment form here */}
                      <div className="rounded-lg border p-4">
                        <p className="text-center text-sm text-muted-foreground">
                          This is a demo application. No actual payment will be processed.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={handlePurchase} disabled={processingPayment}>
                        {processingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay ₹${selectedPlan.price}`
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  )
}
