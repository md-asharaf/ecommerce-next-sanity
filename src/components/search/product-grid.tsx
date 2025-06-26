import { ExpandedProduct } from "@/types"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: ExpandedProduct[]
  viewMode: "grid" | "list"
  wishlistedItems: string[]
  onToggleWishlist: (productId: string) => void
  onAddToCart: (productId: string) => void
}

export async function ProductGrid({ products, viewMode, wishlistedItems, onToggleWishlist, onAddToCart }: ProductGridProps) {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
      }`}
    >
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          viewMode={viewMode}
          isWishlisted={wishlistedItems.includes(product._id)}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
