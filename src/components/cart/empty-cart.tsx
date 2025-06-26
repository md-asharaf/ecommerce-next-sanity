"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
export function EmptyCart() {
  return (
    <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
            <h1 className="mt-6 text-3xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="mt-2 text-gray-600">Start shopping to add items to your cart</p>
            <Link href='/'>
              <Button className="cursor-pointer mt-8" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
  )
}
