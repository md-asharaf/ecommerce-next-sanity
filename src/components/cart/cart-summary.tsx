import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export const CartSummary = ({ subtotal }:{subtotal:number}) => {
  const discount = 0
  const shipping = subtotal >= 100 ? 0 : 10
  const tax = subtotal * 0.07
  const total = subtotal - discount + shipping + tax
  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping === 0 && <p className="text-xs text-green-600">Free shipping on orders over $100</p>}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Link href='/checkout'>
          <Button className="w-full h-12 text-base font-semibold" size="lg">
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <div className="text-center">
          <p className="text-xs text-gray-500">Secure checkout • Free returns • Fast shipping</p>
        </div>
      </CardContent>
    </Card>
  )
}
