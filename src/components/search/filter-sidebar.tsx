"use client"

import { Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Brand, Category } from "../../../sanity.types"
import { SearchFilters } from "@/types"

interface FilterSidebarProps {
  categories: Category[]
  brands: Brand[]
  filters: SearchFilters
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  onClearFilters: () => void
}

export function FilterSidebar({ categories, brands, filters, onFiltersChange, onClearFilters }: FilterSidebarProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.selectedCategories, categoryId]
      : filters.selectedCategories.filter((id:string) => id !== categoryId)
    onFiltersChange({ selectedCategories: newCategories })
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.selectedBrands, brandId]
      : filters.selectedBrands.filter((id:string) => id !== brandId)
    onFiltersChange({ selectedBrands: newBrands })
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <Filter className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category._id}`}
                  checked={filters.selectedCategories.includes(category._id)}
                  onCheckedChange={(checked) => handleCategoryChange(category._id, checked as boolean)}
                />
                <Label htmlFor={`category-${category._id}`} className="text-sm font-medium">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Brands</h3>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand._id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand._id}`}
                  checked={filters.selectedBrands.includes(brand._id)}
                  onCheckedChange={(checked) => handleBrandChange(brand._id, checked as boolean)}
                />
                <Label htmlFor={`brand-${brand._id}`} className="text-sm font-medium">
                  {brand.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ priceRange: value as [number, number] })}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className={`flex items-center space-x-2 w-full text-left p-2 rounded-md hover:bg-gray-50 ${
                  filters.selectedRating === rating ? "bg-gray-100" : ""
                }`}
                onClick={() => onFiltersChange({ selectedRating: filters.selectedRating === rating ? null : rating })}
              >
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">& up</span>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Additional Filters */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStockOnly}
                onCheckedChange={(checked) => onFiltersChange({ inStockOnly: checked as boolean })}
              />
              <Label htmlFor="in-stock" className="text-sm font-medium">
                In Stock Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featuredOnly}
                onCheckedChange={(checked) => onFiltersChange({ featuredOnly: checked as boolean })}
              />
              <Label htmlFor="featured" className="text-sm font-medium">
                Featured Products
              </Label>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={onClearFilters} className="w-full">
          Clear All Filters
        </Button>
      </div>
    </Card>
  )
}
