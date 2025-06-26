"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchFilters } from "@/types"
import { Brand, Category } from "../../../sanity.types"

interface ActiveFiltersProps {
  filters: SearchFilters
  categories: Category[]
  brands: Brand[]
  onRemoveCategory: (categoryId: string) => void
  onRemoveBrand: (brandId: string) => void
  onRemoveRating: () => void
  onRemoveInStock: () => void
  onRemoveFeatured: () => void
  onClearAll: () => void
}

export function ActiveFilters({
  filters,
  categories,
  brands,
  onRemoveCategory,
  onRemoveBrand,
  onRemoveRating,
  onRemoveInStock,
  onRemoveFeatured,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.selectedCategories.length > 0 ||
    filters.selectedBrands.length > 0 ||
    filters.selectedRating ||
    filters.inStockOnly ||
    filters.featuredOnly

  if (!hasActiveFilters) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Active filters:</span>

        {filters.selectedCategories.map((categoryId:string) => {
          const category = categories.find((c) => c._id === categoryId)
          return (
            <Badge key={categoryId} variant="secondary" className="gap-1">
              {category?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onRemoveCategory(categoryId)} />
            </Badge>
          )
        })}

        {filters.selectedBrands.map((brandId:string) => {
          const brand = brands.find((b) => b._id === brandId)
          return (
            <Badge key={brandId} variant="secondary" className="gap-1">
              {brand?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onRemoveBrand(brandId)} />
            </Badge>
          )
        })}

        {filters.selectedRating && (
          <Badge variant="secondary" className="gap-1">
            {filters.selectedRating}+ Stars
            <X className="h-3 w-3 cursor-pointer" onClick={onRemoveRating} />
          </Badge>
        )}

        {filters.inStockOnly && (
          <Badge variant="secondary" className="gap-1">
            In Stock Only
            <X className="h-3 w-3 cursor-pointer" onClick={onRemoveInStock} />
          </Badge>
        )}

        {filters.featuredOnly && (
          <Badge variant="secondary" className="gap-1">
            Featured Only
            <X className="h-3 w-3 cursor-pointer" onClick={onRemoveFeatured} />
          </Badge>
        )}

        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Clear All
        </Button>
      </div>
    </div>
  )
}
