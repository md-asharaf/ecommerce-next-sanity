"use client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Variant } from "../../../sanity.types"

interface VariantSelectorProps {
  variants: Variant[]
  selectedVariant: Variant | null
  onVariantSelect: (variant: Variant) => void
}

export function VariantSelector({ variants, selectedVariant, onVariantSelect }: VariantSelectorProps) {
  const colors = Array.from(new Set(variants.map((v) => v.color))).filter(Boolean) as string[]
  const sizes = Array.from(new Set(variants.map((v) => v.size))).filter(Boolean) as string[]

  const selectColor = (color: string) => {
    const variantWithColor = variants.find(
      (v) => v.color === color && (selectedVariant?.size ? v.size === selectedVariant.size : true),
    )
    if (variantWithColor) {
      onVariantSelect(variantWithColor)
    }
  }

  const selectSize = (size: string) => {
    const variantWithSize = variants.find(
      (v) => v.size === size && (selectedVariant?.color ? v.color === selectedVariant.color : true),
    )
    if (variantWithSize) {
      onVariantSelect(variantWithSize)
    }
  }

  return (
    <div className="space-y-4">
      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-900">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <TooltipProvider key={color}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`h-10 w-10 rounded-full border ${
                        selectedVariant?.color === color ? "ring-2 ring-rose-500 ring-offset-2" : "ring-1 ring-gray-200"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => selectColor(color)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{color}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <button className="text-sm font-medium text-rose-600 hover:text-rose-500">Size Guide</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variantForSize = variants.find(
                (v) => v.size === size && (selectedVariant?.color ? v.color === selectedVariant.color : true),
              )
              const isOutOfStock = variantForSize ? variantForSize.stock === 0 : false

              return (
                <button
                  key={size}
                  className={`min-w-[4rem] rounded-md border px-3 py-2 text-sm ${
                    selectedVariant?.size === size
                      ? "border-rose-500 bg-rose-50 text-rose-600"
                      : "border-gray-200 bg-white text-gray-900"
                  } ${isOutOfStock ? "cursor-not-allowed opacity-50" : "hover:border-gray-300"}`}
                  onClick={() => !isOutOfStock && selectSize(size)}
                  disabled={isOutOfStock}
                >
                  {size}
                  {isOutOfStock && <span className="ml-1 text-xs">(Out of stock)</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
