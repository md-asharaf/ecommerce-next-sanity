"use client"

import Image from "next/image"
import { CalendarDays, Download, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { OrderStatus } from "@prisma/client"
import { ExpandedOrder } from "@/types"

interface OrderCardProps {
  order: ExpandedOrder
  onViewDetails: (orderId: string) => void
  onDownloadInvoice: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
}

export function OrderCard({ order, onViewDetails, onDownloadInvoice, onCancelOrder }: OrderCardProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "SHIPPED":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      case "REFUNDED":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">Order #{order.id.slice(-8)}</CardTitle>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {formatDate(order.createdAt.toString())}
              </div>
              <span>•</span>
              <span>
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(order.status)} border`}>
              {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
            </Badge>
            <div className="text-right">
              <div className="text-lg font-semibold">${order.finalAmount.toFixed(2)}</div>
              {order.discountAmount > 0 && (
                <div className="text-sm text-gray-500 line-through">${order.totalAmount.toFixed(2)}</div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Order Items */}
        <div className="space-y-3 mb-4">
          {order.items.slice(0, 2).map(({product,quantity}) => (
            <div key={product._id} className="flex products-center gap-3">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.title || "Product Image"}
                width={48}
                height={48}
                className="rounded-lg border object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                <p className="text-sm text-gray-500">
                  Qty: {quantity} × ${product.discountedPrice?.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-gray-500 pl-15">
              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <Separator className="my-4" />

        {/* Order Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Subtotal</p>
            <p className="font-medium">${(order.totalAmount - order.shippingCost - order.taxAmount).toFixed(2)}</p>
          </div>
          {order.discountAmount > 0 && (
            <div>
              <p className="text-gray-600">Discount</p>
              <p className="font-medium text-green-600">-${order.discountAmount.toFixed(2)}</p>
            </div>
          )}
          <div>
            <p className="text-gray-600">Shipping</p>
            <p className="font-medium">{order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}</p>
          </div>
          <div>
            <p className="text-gray-600">Tax</p>
            <p className="font-medium">${order.taxAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-1">Shipping Address</p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onViewDetails(order.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {order.status === "DELIVERED" && (
            <Button variant="outline" className="flex-1" onClick={() => onDownloadInvoice(order.id)}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          )}
          {(order.status === "PENDING") && (
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700"
              onClick={() => onCancelOrder(order.id)}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
