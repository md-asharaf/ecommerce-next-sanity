"use client"

import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  reviewCount?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
}

export function RatingDisplay({ rating, reviewCount, size = "md", showCount = true }: RatingDisplayProps) {
  const starSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${star <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      {showCount && reviewCount && <span className={`${textSize} text-gray-600`}>({reviewCount})</span>}
    </div>
  )
}
