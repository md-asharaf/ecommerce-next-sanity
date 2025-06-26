"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Minus, Plus, Share2, ShoppingBag, Star, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AddToCartButton from "./add-to-cart"
import { ExpandedProduct } from "@/types"
import { Variant } from "../../sanity.types"
import { WishlistButton } from "./wishlist"

interface ProductDetailsProps {
    product: ExpandedProduct
    variants: Variant[]
    isWishlisted: boolean
    wishlistId?: string
}
export default function ProductDetails({ product, variants, isWishlisted, wishlistId }: ProductDetailsProps) {
    // State for the product page
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [mainImage, setMainImage] = useState("")
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Group variants by attribute for selection UI
    const colors = Array.from(new Set(variants.map((v) => v.color))).filter(Boolean) as string[]
    const sizes = Array.from(new Set(variants.map((v) => v.size))).filter(Boolean) as string[]

    useEffect(() => {
        if (product.hasVariants && variants.length > 0) {
            setSelectedVariant(variants[0])
            setMainImage(variants?.[0]?.images?.[0] || "")
            setCurrentImageIndex(0)
        } else {
            setMainImage(product.images?.[0] || "")
            setCurrentImageIndex(0)
        }
    }, [])

    const selectVariant = (variantId: string) => {
        const variant = variants.find((v) => v._id === variantId)
        if (variant) {
            setSelectedVariant(variant)
            setMainImage(variant?.images?.[0] || "")
            setCurrentImageIndex(0)
        }
    }

    const selectColor = (color: string) => {
        const variantWithColor = variants.find(
            (v) => v.color === color && (selectedVariant?.size ? v.size === selectedVariant.size : true),
        )
        if (variantWithColor) {
            selectVariant(variantWithColor._id)
        }
    }

    const selectSize = (size: string) => {
        const variantWithSize = variants.find(
            (v) => v.size === size && (selectedVariant?.color ? v.color === selectedVariant.color : true),
        )
        if (variantWithSize) {
            selectVariant(variantWithSize._id)
        }
    }

    const incrementQuantity = () => {
        const maxStock = selectedVariant ? selectedVariant.stock : product.stock
        if (quantity < (maxStock ?? 0)) {
            setQuantity(quantity + 1)
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const nextImage = () => {
        const images = selectedVariant ? selectedVariant.images : product.images
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (images?.length ?? 1))
        setMainImage(images?.[(currentImageIndex + 1) % images.length] || "")
    }

    const prevImage = () => {
        const images = selectedVariant ? selectedVariant.images : product.images
        if (!images?.length) return

        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
        setMainImage(images[(currentImageIndex - 1 + images.length) % images.length] || "")
    }

    const selectImage = (index: number) => {
        const images = selectedVariant ? selectedVariant.images : product.images
        if (!images?.length) return

        setCurrentImageIndex(index)
        setMainImage(images[index] || "")
    }

    const currentPrice = selectedVariant
        ? selectedVariant.discountedPrice || selectedVariant.price
        : product.discountedPrice || product.originalPrice

    const originalPrice = selectedVariant ? selectedVariant.price : product.originalPrice

    const discountPercentage =
        originalPrice && currentPrice && originalPrice > currentPrice
            ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
            : 0

    const inStock = selectedVariant ? (selectedVariant.stock ?? 0) > 0 : (product.stock ?? 0) > 0
    const lowStock = selectedVariant ? (selectedVariant.stock ?? 0) <= 5 : (product.stock ?? 0) <= 5

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
                            <Image
                                src={mainImage || "/placeholder.svg"}
                                alt={product.title || "Product Image"}
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {discountPercentage > 0 && (
                                <div className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-medium text-white">
                                    {discountPercentage}% OFF
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-between p-4">
                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full opacity-80" onClick={prevImage}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full opacity-80" onClick={nextImage}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {(selectedVariant ? selectedVariant.images : product.images)?.map((image, index) => (
                                <button
                                    key={index}
                                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${currentImageIndex === index ? "ring-2 ring-rose-500" : ""
                                        }`}
                                    onClick={() => selectImage(index)}
                                >
                                    <Image
                                        src={image || "/placeholder.svg"}
                                        alt={`${product.title} thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover object-center"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Video Preview (if available) */}
                        {product.videos && product.videos.length > 0 && (
                            <div className="mt-4">
                                <h3 className="mb-2 text-sm font-medium text-gray-900">Product Video</h3>
                                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                                    <video
                                        controls
                                        poster={product.images?.[0] || "/placeholder.svg"}
                                        className="h-full w-full object-cover"
                                        src={product.videos[0]}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col space-y-6">
                        {/* Brand & Title */}
                        <div>
                            {product.brand && <h3 className="text-sm font-medium text-gray-500">{product.brand?.name || "Brand"}</h3>}
                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <Star
                                        key={rating}
                                        className={`h-4 w-4 ${rating <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                                    />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">4.0 (24 reviews)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold text-gray-900">${currentPrice?.toFixed(2) || '0.00'}</p>
                            {discountPercentage > 0 && (
                                <p className="text-lg text-gray-500 line-through">${originalPrice?.toFixed(2) || '0.00'}</p>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="text-gray-600">{product.description}</p>

                        {/* Highlights */}
                        {product.highlights && product.highlights.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
                                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                                    {product.highlights.map((highlight, index) => (
                                        <li key={index}>{highlight}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Variant Selection */}
                        {product.hasVariants && (
                            <div className="space-y-4">
                                {/* Color Selection */}
                                {colors.length > 0 && (
                                    <div>
                                        <h3 className="mb-2 text-sm font-medium text-gray-900">Color</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {colors.map((color) => (
                                                <TooltipProvider key={color}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                className={`h-10 w-10 rounded-full border ${selectedVariant?.color === color
                                                                    ? "ring-2 ring-rose-500 ring-offset-2"
                                                                    : "ring-1 ring-gray-200"
                                                                    }`}
                                                                style={{ backgroundColor: color.toLowerCase() }}
                                                                onClick={() => selectColor(color)}
                                                            />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{color}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Size Selection */}
                                {sizes.length > 0 && (
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">Size</h3>
                                            <button className="text-sm font-medium text-rose-600 hover:text-rose-500">Size Guide</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {sizes.map((size) => {
                                                const variantForSize = variants.find(
                                                    (v) => v.size === size && (selectedVariant?.color ? v.color === selectedVariant.color : true),
                                                )
                                                const isOutOfStock = variantForSize ? variantForSize.stock === 0 : false

                                                return (
                                                    <button
                                                        key={size}
                                                        className={`min-w-[4rem] rounded-md border px-3 py-2 text-sm ${selectedVariant?.size === size
                                                            ? "border-rose-500 bg-rose-50 text-rose-600"
                                                            : "border-gray-200 bg-white text-gray-900"
                                                            } ${isOutOfStock ? "cursor-not-allowed opacity-50" : "hover:border-gray-300"}`}
                                                        onClick={() => !isOutOfStock && selectSize(size)}
                                                        disabled={isOutOfStock}
                                                    >
                                                        {size}
                                                        {isOutOfStock && <span className="ml-1 text-xs">(Out of stock)</span>}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quantity & Stock */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                                <div>
                                    {inStock ? (
                                        lowStock ? (
                                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                                                Low Stock: {selectedVariant ? selectedVariant.stock : product.stock} left
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-green-500 text-green-600">
                                                In Stock
                                            </Badge>
                                        )
                                    ) : (
                                        <Badge variant="outline" className="border-red-500 text-red-600">
                                            Out of Stock
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center rounded-md border">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-none rounded-l-md"
                                        onClick={decrementQuantity}
                                        disabled={quantity <= 1 || !inStock}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <div className="w-12 text-center">
                                        <span className="text-sm font-medium">{quantity}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-none rounded-r-md"
                                        onClick={incrementQuantity}
                                        disabled={!inStock || quantity >= (selectedVariant?.stock ?? product.stock ?? 0)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart & Wishlist */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <AddToCartButton product={product} variant={selectedVariant!} />
                            <WishlistButton productId={product._id} disabled={!inStock} isWishlisted={isWishlisted} wishlistId={wishlistId} />
                        </div>

                        {/* Shipping Info */}
                        <div className="rounded-lg bg-gray-50 p-4">
                            <div className="flex items-center gap-3">
                                <Truck className="h-5 w-5 text-gray-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Free shipping</p>
                                    <p className="text-sm text-gray-600">Delivery within 3-5 business days</p>
                                </div>
                            </div>
                        </div>

                        {/* Share */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Share:</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <Tabs defaultValue="details">
                        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="specifications">Specifications</TabsTrigger>
                            <TabsTrigger value="care">Care Instructions</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </TabsList>
                        <div className="mt-6 rounded-lg border p-6">
                            <TabsContent value="details" className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
                                    <p className="mt-2 text-gray-600">{product.description}</p>
                                </div>

                                {product.features && product.features.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                                        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                                            {product.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {product.includedItems && product.includedItems.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
                                        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                                            {product.includedItems.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {product.usage && product.usage.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Usage Instructions</h3>
                                        <ol className="mt-2 list-inside list-decimal space-y-1 text-gray-600">
                                            {product.usage.map((instruction, index) => (
                                                <li key={index}>{instruction}</li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="specifications" className="space-y-6">
                                {product.specifications && product.specifications.length > 0 && (
                                    <div className="overflow-hidden rounded-lg border">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <tbody className="divide-y divide-gray-200">
                                                {product.specifications.map((spec, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                            {spec.label}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{spec.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {product.material && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Material</h3>
                                        <p className="mt-2 text-gray-600">{product.material}</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="care" className="space-y-6">
                                {product.careInstructions && product.careInstructions.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Care Instructions</h3>
                                        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                                            {product.careInstructions.map((instruction, index) => (
                                                <li key={index}>{instruction}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {product.dosAndDonts && product.dosAndDonts.length > 0 && (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                                            <h4 className="mb-2 font-semibold text-green-800">Do's</h4>
                                            <ul className="list-inside list-disc space-y-1 text-green-700">
                                                {product.dosAndDonts
                                                    .filter((item) => item.type === "Do")
                                                    .map((item, index) => (
                                                        <li key={index}>{item.text}</li>
                                                    ))}
                                            </ul>
                                        </div>
                                        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                                            <h4 className="mb-2 font-semibold text-red-800">Don'ts</h4>
                                            <ul className="list-inside list-disc space-y-1 text-red-700">
                                                {product.dosAndDonts
                                                    .filter((item) => item.type === "Don't")
                                                    .map((item, index) => (
                                                        <li key={index}>{item.text}</li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="reviews">
                                <div className="text-center py-8">
                                    <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                                    <p className="mt-2 text-gray-600">Reviews will appear here</p>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">You may also like</h2>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <Card key={item} className="overflow-hidden">
                                <div className="aspect-square relative">
                                    <Image
                                        src={`/placeholder.svg?height=300&width=300&text=Related+${item}`}
                                        alt={`Related product ${item}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-medium text-gray-900 line-clamp-1">Related Product {item}</h3>
                                    <p className="mt-1 text-sm text-gray-500">Category</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="font-semibold text-gray-900">$199.99</p>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <ShoppingBag className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Recently Viewed */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Recently Viewed</h2>
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="group relative">
                                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                                    <Image
                                        src={`/placeholder.svg?height=200&width=200&text=Recent+${item}`}
                                        alt={`Recent product ${item}`}
                                        width={200}
                                        height={200}
                                        className="object-cover object-center transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-1">Recent Product {item}</h3>
                                <p className="text-sm font-medium text-gray-900">$99.99</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
