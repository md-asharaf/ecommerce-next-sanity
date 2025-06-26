"use client"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import Link from "next/link"
import { PromoCode } from "@/components/promo-code"
import { CartSummary } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"
import { CartItemComponent } from "@/components/cart/cart-item"

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => state.getTotalPrice())
  const applyPromoCode = () => { }
  if (items.length === 0) {
    return (
      <EmptyCart />
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">{items.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <CartItemComponent item={item} key={item.id || index} />
            ))}

            <div className="pt-4">
              <Link href='/'>
                <Button variant="outline" className="cursor-pointer w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <PromoCode onApplyPromo={applyPromoCode} />
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      </div>
    </div>
  )
}
