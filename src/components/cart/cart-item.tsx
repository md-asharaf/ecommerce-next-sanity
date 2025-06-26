import { Card, CardContent } from "@/components/ui/card"
import { CartItem } from "@/store/cart"
import { Heart } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import QuantitySelector from "../quantity-selector"
import RemoveFromCartButton from "./remove-from-cart"

export const CartItemComponent = ({ item }: { item: CartItem }) => {
  const { product, variant, quantity } = item;
  return (
    <Card key={item.id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Product Image */}
          <div className="relative flex-shrink-0">
            <Image
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.title || "Product Image"}
              width={120}
              height={120}
              className="rounded-lg border object-cover"
            />
            {!product.stock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.title}</h3>
                {variant && <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  {variant.color && <span>Color: {variant.color}</span>}
                  {variant.size && <span>Size: {variant.size}</span>}
                </div>}
              </div>
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={()=>removeItem(product._id,variant?._id,item.quantity)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>

            {/* Price and Stock Status */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-semibold text-gray-900">${product.originalPrice?.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {!variant?.stock && !product.stock && (
                <Badge variant="destructive" className="ml-2">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Quantity Controls and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <QuantitySelector item={item} />
                <span className="text-sm text-gray-500">${(product.originalPrice ?? 0 * item.quantity).toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Heart className="h-4 w-4 mr-1" />
                  Save for later
                </Button>
                <RemoveFromCartButton productId={product._id} variantId={variant?._id} quantity={quantity} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}