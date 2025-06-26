"use client"
import { useState } from "react"
import { useCartStore } from "@/store/cart"
import { Variant } from "@/../sanity.types"
import { Button } from "./ui/button"
import { useAuth } from "@clerk/nextjs"
import { ApiResponse, axiosInstance } from "@/lib/axios"
import { Loader2, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Item } from "@prisma/client"
import { ExpandedProduct } from "@/types"

interface AddToCartButtonProps {
    product: ExpandedProduct;
    variant?: Variant;
    disabled?: boolean;
    quantity?: number;
}

const AddToCartButton = ({ product, variant, quantity=1,disabled = false }: AddToCartButtonProps) => {
    const [loading, setLoading] = useState(false);
    const { userId, isLoaded } = useAuth()
    const { addItem } = useCartStore();
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled || !isLoaded) return;
        setLoading(true);
        const {category,brand,rating,...rest} = product
        try {
            if (userId) {
                const { data } = await axiosInstance.post<ApiResponse<{ item: Item }>>('/cart/item', {
                    productId: product._id,
                    variantId: variant?._id,
                    quantity: 1,
                    unitPrice: variant?.discountedPrice || product.discountedPrice || 0,
                    originalPrice: variant?.price || product.originalPrice || 0
                });
                addItem(rest, variant, quantity, data.data?.item.id);
            } else {
                addItem(rest, variant);
            }
            toast.success("Item added to cart");
        } catch (error) {
            toast.error("Failed to add item to cart");
            console.error("Error adding item to cart:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button disabled={disabled}
            onClick={handleAddToCart}
            className="gap-2"
        >
            <ShoppingBag className="h-5 w-5" />
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Add to Cart"}
        </Button>
    )
}

export default AddToCartButton