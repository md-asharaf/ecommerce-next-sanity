"use client"

import { useState } from "react"
import { CalendarDays, Eye, Package, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Address, Order, OrderStatus } from "@prisma/client"
import { CartItem } from "@/store/cart"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import Link from "next/link"

export interface PopulatedOrder extends Order {
    items: CartItem[];
    shippingAddress: Address
}

interface PaginatedOrdersProps {
    orders: PopulatedOrder[]
    currentPage: number
    totalPages: number
}

export default function PaginatedOrdersPage({ orders, currentPage, totalPages = 10 }: PaginatedOrdersProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sortBy, setSortBy] = useState("newest")

    if (!orders || orders.length === 0) {
        return (
            <Card>
                <CardContent className="py-16 text-center">
                    <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </CardContent>
            </Card>
        )
    }
    // Filter and sort orders
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some((item) => item.product.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesStatus = statusFilter === "all" || order.status === statusFilter
        return matchesSearch && matchesStatus
    })
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            if (sortBy === "amount-high") return b.finalAmount - a.finalAmount
            if (sortBy === "amount-low") return a.finalAmount - b.finalAmount
            return 0
        })

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "PROCESSING":
                return "bg-purple-100 text-purple-800 border-purple-200"
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
        <div>
            <div className="space-y-6">
                {
                    filteredOrders.map((order) => (
                        <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Order #{order.id.slice(-8)}</CardTitle>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <CalendarDays className="h-4 w-4" />
                                                {formatDate(order.createdAt.toDateString())}
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
                                <div className="space-y-3 mb-4">
                                    {order.items.slice(0, 2).map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <img
                                                src={item.product.images?.[0] || "/placeholder.svg"}
                                                alt={item.product.title}
                                                className="h-12 w-12 rounded-lg border object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.product.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity} × ${item.product.originalPrice?.toFixed(2)}
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

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Subtotal</p>
                                        <p className="font-medium">
                                            ${(order.totalAmount - order.shippingCost - order.taxAmount).toFixed(2)}
                                        </p>
                                    </div>
                                    {order.discountAmount > 0 && (
                                        <div>
                                            <p className="text-gray-600">Discount</p>
                                            <p className="font-medium text-green-600">-${order.discountAmount.toFixed(2)}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-gray-600">Shipping</p>
                                        <p className="font-medium">
                                            {order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Tax</p>
                                        <p className="font-medium">${order.taxAmount.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900 mb-1">Shipping Address</p>
                                    <p className="text-sm text-gray-600">
                                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                        {order.shippingAddress.postalCode}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                    <Link href={`/order/${order.id}`}>
                                        <Button variant="outline" className="flex-1">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </Link>
                                    {order.status === "DELIVERED" && (
                                        <Button variant="outline" className="flex-1">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Invoice
                                        </Button>
                                    )}
                                    {(order.status === "PENDING" || order.status === "PROCESSING") && (
                                        <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                                            Cancel Order
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>

            {totalPages > 1 && (
                <Card className="mt-8">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * 5 + 1} to{" "}
                                {Math.min(currentPage * 5, filteredOrders.length)} of {filteredOrders.length} orders
                            </div>
                            {(
                                <Pagination>
                                    <PaginationContent>
                                        {currentPage > 1 && <PaginationItem>
                                            <PaginationPrevious

                                                href={`?page=${currentPage - 1}`}
                                            />
                                        </PaginationItem>}

                                        {Array.from({ length: totalPages }, (_, idx) => {
                                            const page = idx + 1
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href={`?page=${page}`}
                                                        isActive={currentPage === page}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        })}

                                        {currentPage < totalPages && <PaginationItem>
                                            <PaginationNext
                                                href={`?page=${currentPage + 1}`}
                                            />
                                        </PaginationItem>}
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div >
    )
}
