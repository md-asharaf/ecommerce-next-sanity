"use client"

import Image from "next/image"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExpandedProduct } from "@/types"

interface ProductCardProps {
  product: ExpandedProduct
  viewMode: "grid" | "list"
  isWishlisted: boolean
  onToggleWishlist: (productId: string) => void
  onAddToCart: (productId: string) => void
}

export function ProductCard({ product, viewMode, isWishlisted, onToggleWishlist, onAddToCart }: ProductCardProps) {
  const currentPrice = product.discountedPrice || product.originalPrice || 0
  const discountPercentage = product.discountedPrice
    ? Math.round(((product.originalPrice ?? 0 - product.discountedPrice) / (product.originalPrice ?? 0)) * 100)
    : 0

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="relative w-48 h-48 flex-shrink-0">
            <Image src={product.images?.[0] || "/placeholder.svg"} alt={product.title!} fill className="object-cover" />
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-rose-500">{discountPercentage}% OFF</Badge>
            )}
            {product.isFeatured && <Badge className="absolute top-2 right-2 bg-amber-500">Featured</Badge>}
          </div>
          <CardContent className="flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                <p className="text-sm text-gray-500">{product.brand?.name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleWishlist(product._id)}
                className="text-gray-400 hover:text-rose-500"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
              </Button>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>

            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.floor(product.rating.avg) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.rating.count})</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
                {product.discountedPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice?.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {(product.stock ?? 0) > 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    Out of Stock
                  </Badge>
                )}
                <Button size="sm" disabled={(product.stock ?? 0) <= 0} onClick={() => onAddToCart(product._id)}>
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.title!}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-rose-500">{discountPercentage}% OFF</Badge>
        )}
        {product.isFeatured && <Badge className="absolute top-2 right-2 bg-amber-500">Featured</Badge>}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onToggleWishlist(product._id)}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
          <p className="text-sm text-gray-500">{product.brand?.name}</p>
        </div>

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.floor(product.rating.avg) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.rating.count})</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
            {product.discountedPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>
          {product.stock ?? 0 > 0 ? (
            <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
              In Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
              Out of Stock
            </Badge>
          )}
        </div>

        <Button className="w-full" size="sm" disabled={(product.stock ?? 0) <= 0} onClick={() => onAddToCart(product._id)}>
          <ShoppingBag className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
