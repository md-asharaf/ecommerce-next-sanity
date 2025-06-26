"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Product } from "../../../sanity.types"

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="details">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="care">Care Instructions</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <div className="mt-6 rounded-lg border p-6">
        <TabsContent value="details" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {product.includedItems && product.includedItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                {product.includedItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {product.usage && product.usage.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Usage Instructions</h3>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-gray-600">
                {product.usage.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}
        </TabsContent>

        <TabsContent value="specifications" className="space-y-6">
          {product.specifications && product.specifications.length > 0 && (
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {product.specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{spec.label}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.material && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Material</h3>
              <p className="mt-2 text-gray-600">{product.material}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="care" className="space-y-6">
          {product.careInstructions && product.careInstructions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Care Instructions</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                {product.careInstructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          )}

          {product.dosAndDonts && product.dosAndDonts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <h4 className="mb-2 font-semibold text-green-800">Do's</h4>
                <ul className="list-inside list-disc space-y-1 text-green-700">
                  {product.dosAndDonts
                    .filter((item) => item.type === "Do")
                    .map((item, index) => (
                      <li key={index}>{item.text}</li>
                    ))}
                </ul>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                <h4 className="mb-2 font-semibold text-red-800">Don'ts</h4>
                <ul className="list-inside list-disc space-y-1 text-red-700">
                  {product.dosAndDonts
                    .filter((item) => item.type === "Don't")
                    .map((item, index) => (
                      <li key={index}>{item.text}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
            <p className="mt-2 text-gray-600">Reviews will appear here</p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
