"use client"

interface PriceDisplayProps {
  currentPrice: number
  originalPrice?: number
  className?: string
  showDiscount?: boolean
}

export function PriceDisplay({ currentPrice, originalPrice, className = "", showDiscount = true }: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > currentPrice
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-lg font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
      {hasDiscount && (
        <>
          <span className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          {showDiscount && <span className="text-sm text-green-600 font-medium">({discountPercentage}% off)</span>}
        </>
      )}
    </div>
  )
}
