"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Filter, Grid, List, Star, Heart, ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ExpandedCategory, ExpandedProduct } from "@/types"
import AddToCartButton from "../add-to-cart"
import { Brand } from "../../../sanity.types"

interface CatgeoryDetailsProps {
  category: ExpandedCategory
  products: ExpandedProduct[],
  brands: Brand[]
}
export const CategoryDetails = ({ category, products, brands }: CatgeoryDetailsProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [showSaleOnly, setShowSaleOnly] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    const filtered = products.filter((product) => {
      const productPrice = product.discountedPrice ?? product.originalPrice ?? 0
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand?.name || "")
      const matchesStock = !showInStockOnly || product.stock
      const matchesSale = !showSaleOnly || product.isSale

      return matchesPrice && matchesBrand && matchesStock && matchesSale
    })
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.discountedPrice! - b.discountedPrice!)
        break
      case "price-high":
        filtered.sort((a, b) => b.discountedPrice! - a.discountedPrice!)
        break
      case "rating":
        filtered.sort((a, b) => b.rating.avg - a.rating.avg)
        break
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a._createdAt).getTime();
          const dateB = new Date(b._createdAt).getTime();
          return dateB - dateA;
        })
        break
      default:
        break
    }
    setFilteredProducts(filtered)
  }, [priceRange, selectedBrands, showInStockOnly, showSaleOnly, sortBy])

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandId])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brandId))
    }
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={3000} step={50} className="mb-4" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand._id} className="flex items-center space-x-2">
              <Checkbox
                id={brand._id}
                checked={selectedBrands.includes(brand._id)}
                onCheckedChange={(checked) => handleBrandChange(brand._id, checked as boolean)}
              />
              <label htmlFor={brand._id} className="text-sm text-gray-700 cursor-pointer">
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Filters</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={showInStockOnly}
              onCheckedChange={(checked) => setShowInStockOnly(checked === true)}
            />
            <label htmlFor="inStock" className="text-sm text-gray-700 cursor-pointer">
              In Stock Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onSale"
              checked={showSaleOnly}
              onCheckedChange={(checked) => setShowSaleOnly(checked === true)}
            />
            <label htmlFor="onSale" className="text-sm text-gray-700 cursor-pointer">
              On Sale
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/categories" className="text-gray-600 hover:text-gray-900">
              Categories
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name || "Category Image"}
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="text-white max-w-2xl">
              <Link href="/categories" className="inline-flex items-center text-white/80 hover:text-white mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
              <p className="text-xl opacity-90 mb-4">{category.description}</p>
              <p className="text-lg opacity-80">{category.productCount} products available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <h2 className="font-semibold text-xl mb-6">Filters</h2>
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">{filteredProducts.length} Products</h2>

                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
const ProductCard = ({ product }: { product: ExpandedProduct }) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <CardContent className="p-0">
      <div className="relative overflow-hidden">
        <Image
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.title || "Product Image"}
          width={300}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && <Badge className="bg-green-500">New</Badge>}
          {product.isSale && <Badge className="bg-red-500">Sale</Badge>}
          {!product.stock && <Badge variant="secondary">Out of Stock</Badge>}
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="rounded-full">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">{product.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating.avg) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating.reviewsCount})</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">${product.discountedPrice}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <span className="text-sm text-gray-600">{product.brand?.name}</span>
        </div>
        <Button className="w-full" disabled={!product.stock} variant={product.stock ? "default" : "secondary"}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          <AddToCartButton product={product} disabled={!product.stock} />
        </Button>
      </div>
    </CardContent>
  </Card>
)
