"use client"
import { Button } from "./ui/button"
import { useAuth } from "@clerk/nextjs"
import { ApiResponse, axiosInstance } from "@/lib/axios"
import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Item } from "@prisma/client"

interface AddToWishlistProps {
    productId: string;
    isWishlisted?: boolean;
    disabled?: boolean;
    wishlistId?: string;
}

export const WishlistButton = ({ productId, isWishlisted = false, wishlistId, disabled = false }: AddToWishlistProps) => {
    const [wishlisted, setWishlisted] = useState(isWishlisted);
    const [loading, setLoading] = useState(false);
    const { userId, isLoaded } = useAuth()
    const handle = async () => {
        if (disabled || !isLoaded || !userId) return;
        setLoading(true);
        try {
            if (wishlisted) {
                if (wishlistId) {
                    await axiosInstance.delete(`wishlist/${encodeURIComponent(wishlistId)}`)
                    setWishlisted(false);
                    toast.success("Item removed from Wishlist");
                }
            } else {
                await axiosInstance.post<ApiResponse<{ item: Item }>>('/wishlist', {
                    productId,
                });
                setWishlisted(true);
                toast.success("Item added to Wishlist");
            }
        } catch (error) {
            toast.error("Failed to add item to Wishlist");
            console.error("Error adding item to Wishlist:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Button
            variant="outline"
            size="lg"
            className={`gap-2 ${wishlisted ? "text-rose-600" : ""}`
            }
            disabled={disabled}
            onClick={handle}
        >
            <Heart className={`h-5 w-5 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
            {wishlisted ? "Wishlisted" : loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Add to Wishlist"}
        </Button >
    )
}