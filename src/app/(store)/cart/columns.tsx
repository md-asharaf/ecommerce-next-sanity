"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Product } from "../../../../sanity.types"
import QuantitySelector from "@/components/QuantitySelector"
import Link from "next/link"
import { imageUrl } from "@/lib/imageUrl"

export type CartItem = {
  product: Product
  quantity: number
}

export const columns: ColumnDef<CartItem>[] = [
  {
    accessorKey: "product",
    header: () => <div className="text-left font-semibold">PRODUCT</div>,
    cell: ({ row }) => {
      const product = row.getValue("product") as Product
      const url = product?.imageUrl || imageUrl(product?.image!)?.url() || "/placeholder.png"

      return (
        <Link href={`/products/${product.slug?.current}`} className="flex items-center gap-4">
          {url && (
            <img
              src={url}
              alt={product.name}
              className="h-24 w-24 rounded-lg object-cover shadow-sm"
            />
          )}
          <div className="space-y-1 xl:max-w-[300px]">
            <p className="font-medium text-base text-gray-900 truncate">{product.name}</p>
            <p className="text-sm text-gray-500 whitespace-pre-wrap break-words line-clamp-2">{product.description} {product.description}</p>
          </div>
        </Link>
      )
    }
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center font-semibold">PRICE</div>,
    cell: ({ row }) => {
      const product = row.getValue("product") as Product
      const price = product?.price ?? 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(price)

      return <div className="text-right text-gray-900">{formatted}</div>
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-center font-semibold">QUANTITY</div>,
    cell: ({ row }) => {
      const product = row.getValue("product") as Product
      return <div className="flex justify-end"><QuantitySelector product={product} /></div>
    },
  },
  {
    accessorKey: "subtotal",
    header: () => <div className="text-center font-semibold">SUBTOTAL</div>,
    cell: ({ row }) => {
      const product = row.getValue("product") as Product;
      const quantity = row.getValue("quantity") as number
      const subtotal = (product.price ?? 0) * quantity
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(subtotal)

      return <div className="text-right font-medium text-gray-900">{formatted}</div>
    },
  },
]
