"use client"

import { ArrowLeft,Truck, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart"
import PaymentMethod from "@/components/payment-method"
import OrderSummary from "@/components/checkout/order-summary"
import TrustBadges from "@/components/checkout/trust-badges"
export default function CheckoutPage() {
  const router = useRouter()
  const orderItems = useCartStore((state => state.items))

  const subtotal = useCartStore((state) => state.getTotalPrice())
  const onCompleteOrder = () => { }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4 p-0 h-auto" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to cart
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your order below</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" />
                  <Label htmlFor="newsletter" className="text-sm">
                    Email me with news and offers
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping & Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main Street" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input id="apartment" placeholder="Apt 4B" className="mt-1" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP code</Label>
                    <Input id="zip" placeholder="10001" className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <PaymentMethod />
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <OrderSummary items={orderItems} onCompleteOrder={onCompleteOrder} />

            {/* Trust Badges */}
            <TrustBadges />
          </div>
        </div>
      </div>
    </div>
  )
}

