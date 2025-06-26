"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SortSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function SortSelect({ value, onValueChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
        <SelectItem value="rating">Highest Rated</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="name">Name: A to Z</SelectItem>
      </SelectContent>
    </Select>
  )
}
