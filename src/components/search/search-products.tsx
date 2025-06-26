"use client"
import { useState } from "react"
import {
  SlidersHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchBar } from "./search-bar"
import { FilterSidebar } from "./filter-sidebar"
import { SortSelect } from "../sort-select"
import { ViewToggle } from "../view-toggle"
import { ActiveFilters } from "./active-filters"
import { EmptyState } from "./empty-state"
import { ProductGrid } from "./product-grid"
import { PaginationComponent } from "../pagination-component"
import { Brand, Category } from "../../../sanity.types"
import { ExpandedProduct, SearchFilters } from "@/types"
interface SearchProductsProps {
  products: ExpandedProduct[],
  categories: Category[],
  brands: Brand[]
}

export const SearchProducts = ({ products, categories, brands }: SearchProductsProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([])

  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: "",
    selectedCategories: [],
    selectedBrands: [],
    priceRange: [0, 1000],
    selectedRating: null,
    inStockOnly: false,
    featuredOnly: false,
  })

  const productsPerPage = 12

  // Filter and sort logic
  const filteredProducts = products.filter((product) => {
    if (
      filters.searchQuery &&
      !product.title?.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !product.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !product.tags?.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    ) {
      return false
    }

    if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(product.category?._id!)) {
      return false
    }

    if (filters.selectedBrands.length > 0 && (!product.brand || !filters.selectedBrands.includes(product.brand._id))) {
      return false
    }

    const currentPrice = product.discountedPrice || product.originalPrice || 0;
    if (currentPrice < filters.priceRange[0] || currentPrice > filters.priceRange[1]) {
      return false
    }

    if (filters.selectedRating && (!product.rating.avg || product.rating.avg < filters.selectedRating)) {
      return false
    }

    if (filters.inStockOnly && (product.stock ?? 0) <= 0) {
      return false
    }

    if (filters.featuredOnly && !product.isFeatured) {
      return false
    }

    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.discountedPrice || a.originalPrice || 0) - (b.discountedPrice || b.originalPrice || 0)
      case "price-high":
        return (b.discountedPrice || b.originalPrice || 0) - (a.discountedPrice || a.originalPrice || 0)
      case "rating":
        return (b.rating.avg || 0) - (a.rating.avg || 0)
      case "newest":
        return b._id.localeCompare(a._id)
      case "name":
        return a.title?.localeCompare(b.title!) || 0
      case "featured":
      default:
        return b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1
    }
  })

  const totalProducts = sortedProducts.length
  const totalPages = Math.ceil(totalProducts / productsPerPage)
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  // Event handlers
  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      searchQuery: "",
      selectedCategories: [],
      selectedBrands: [],
      priceRange: [0, 1000],
      selectedRating: null,
      inStockOnly: false,
      featuredOnly: false,
    })
    setCurrentPage(1)
  }

  const toggleWishlist = (productId: string) => {
    setWishlistedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleAddToCart = (productId: string) => {
    console.log("Add to cart:", productId)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Search Products</h1>
          <p className="mt-2 text-gray-600">Discover amazing products at great prices</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar value={filters.searchQuery} onChange={(value) => handleFiltersChange({ searchQuery: value })} />
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar
                categories={categories}
                brands={brands}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearAllFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters & Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar
                        categories={categories}
                        brands={brands}
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onClearFilters={clearAllFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-gray-600">
                  {totalProducts} {totalProducts === 1 ? "result" : "results"} found
                </p>
              </div>

              <div className="flex items-center gap-4">
                <SortSelect value={sortBy} onValueChange={setSortBy} />
                <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              </div>
            </div>

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              categories={categories}
              brands={brands}
              onRemoveCategory={(categoryId) =>
                handleFiltersChange({
                  selectedCategories: filters.selectedCategories.filter((id) => id !== categoryId),
                })
              }
              onRemoveBrand={(brandId) =>
                handleFiltersChange({ selectedBrands: filters.selectedBrands.filter((id) => id !== brandId) })
              }
              onRemoveRating={() => handleFiltersChange({ selectedRating: null })}
              onRemoveInStock={() => handleFiltersChange({ inStockOnly: false })}
              onRemoveFeatured={() => handleFiltersChange({ featuredOnly: false })}
              onClearAll={clearAllFilters}
            />

            {/* Products Grid/List */}
            {paginatedProducts.length === 0 ? (
              <EmptyState onClearFilters={clearAllFilters} />
            ) : (
              <ProductGrid
                products={paginatedProducts}
                viewMode={viewMode}
                wishlistedItems={wishlistedItems}
                onToggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
              />
            )}

            {/* Pagination */}
            <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  )
}

