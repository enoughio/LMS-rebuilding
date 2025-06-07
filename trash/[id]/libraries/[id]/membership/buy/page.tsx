"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { Library } from "@/types/library"
import type { MembershipPlan } from "@/types/user" 
import { useAuth } from "@/lib/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export default function MembershipBuyPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan")
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [library, setLibrary] = useState<Library | null>(null)
  const [plan, setPlan] = useState<MembershipPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchaseInProgress, setPurchaseInProgress] = useState(false)

  // Form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (!planId) {
          toast({
            title: "Error",
            description: "No membership plan selected",
            variant: "destructive",
          })
          router.push(`/libraries/${id}/membership`)
          return
        }

        const libraryData = await mockLibraryService.getLibrary(id as string)
        setLibrary(libraryData)

        const selectedPlan = (libraryData ? libraryData.membershipPlans?.find((p) => p.id === planId) : null) as MembershipPlan | null
        if (!libraryData) {
          toast({
            title: "Error",
            description: "Library not found",
            variant: "destructive",
          })
          router.push(`/libraries/${id}/membership`)
          return
        }

        setPlan(selectedPlan)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load membership information",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase a membership",
        variant: "destructive",
      })
      router.push(`/login?redirect=/libraries/${id}/membership/buy?plan=${planId}`)
      return
    }

    if (id) {
      fetchData()
    }
  }, [id, planId, user, router, toast])

  const handlePurchase = async () => {
    if (paymentMethod === "card" && (!cardNumber || !cardName || !expiryDate || !cvv)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all card details",
        variant: "destructive",
      })
      return
    }

    setPurchaseInProgress(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Purchase Successful",
        description: `Your ${plan?.name} membership has been activated`,
      })

      router.push(`/dashboard/member`)
    } catch (error) {
      console.error("Error purchasing membership:", error)
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPurchaseInProgress(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading membership purchase...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!library || !plan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium">Information not found</p>
            <Button variant="outline" onClick={() => router.push("/libraries")}>
              Back to Libraries
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const taxAmount = plan.price * 0.18
  const totalAmount = plan.price + taxAmount

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/libraries/${id}/membership`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Plans
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Purchase Membership</h1>
            <p className="text-muted-foreground">
              Complete your {plan.name} membership purchase for {library.name}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking">Net Banking</Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="mt-6">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input id="upiId" placeholder="yourname@upi" className="mt-1" />
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="mt-6">
                      <Label htmlFor="bank">Select Bank</Label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Punjab National Bank</option>
                      </select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Library</span>
                      <span>{library.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan</span>
                      <span>{plan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>1 Month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan Price</span>
                      <span>₹{plan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (18% GST)</span>
                      <span className="text-muted-foreground">₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handlePurchase} disabled={purchaseInProgress}>
                    {purchaseInProgress ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay ₹{totalAmount.toFixed(2)}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Plan Details */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm">
                        • {feature}
                      </li>
                    ))}
                  </ul>
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
