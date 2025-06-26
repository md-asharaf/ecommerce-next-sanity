import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Lock, Package, Truck } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { CartItem } from '@/store/cart'
interface OrderSummaryProps {
    items: CartItem[],
    onCompleteOrder: () => void
}
const OrderSummary = ({ items,onCompleteOrder }: OrderSummaryProps) => {
    const subtotal = items.reduce((acc, item) => {
        const price = item.variant?.discountedPrice ?? item.product.discountedPrice ?? 0
        return acc + price * item.quantity
    }, 0)
    const shipping = subtotal >= 100 ? 0 : 10
    const tax = subtotal * 0.07
    const total = subtotal + shipping + tax
    return (
        <div className="space-y-6">
            <Card className="sticky top-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-4">
                        {items.map(({ product, variant, id, quantity }) => (
                            <div key={id} className="flex items-center gap-4">
                                <div className="relative">
                                    <Image
                                        src={product.images?.[0] || "/placeholder.svg"}
                                        alt={product.title || "Product Image"}
                                        width={60}
                                        height={60}
                                        className="rounded-lg border object-cover"
                                    />
                                    <Badge
                                        variant="secondary"
                                        className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
                                    >
                                        {quantity}
                                    </Badge>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{variant?.title || product.title}</p>
                                    <p className="text-sm text-gray-500">Qty: {quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">${((variant?.discountedPrice ?? product.discountedPrice ?? 0) * quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    {/* Pricing Breakdown */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">${shipping.toFixed(2)}</span>
                        </div>
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

                    {/* Complete Order Button */}
                    <Button className="w-full h-12 text-base font-semibold" onClick={onCompleteOrder}>
                        <Lock className="mr-2 h-4 w-4" />
                        Complete Order
                    </Button>

                    <p className="text-xs text-center text-gray-500">Your payment information is secure and encrypted</p>
                </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <h3 className="font-semibold text-gray-900">Secure Checkout</h3>
                        <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                SSL Encrypted
                            </div>
                            <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                Free Returns
                            </div>
                            <div className="flex items-center gap-1">
                                <Truck className="h-3 w-3" />
                                Fast Shipping
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrderSummary