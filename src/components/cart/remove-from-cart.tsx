"use client"
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'
interface RemoveFromCartButtonProps {
    productId: string;
    variantId?: string;
    quantity: number;
}

const RemoveFromCartButton = ({ productId, variantId, quantity }: RemoveFromCartButtonProps) => {
    const { removeItem } = useCartStore()
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(productId, variantId, quantity)}
            className="text-gray-500 hover:text-red-500"
        >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
        </Button>
    )
}

export default RemoveFromCartButton