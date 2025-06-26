"use client";
import { ApiResponse, axiosInstance } from "@/lib/axios";
import { useCartStore } from "@/store/cart";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Product, Variant } from "../../sanity.types";
import { toast } from "sonner";

interface CartItem {
  id: string;
  product: Product;
  variant?: Variant;
  quantity: number;
}

const MergeCart = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { setItems, items: localCartItems } = useCartStore();
  const [isMerging, setIsMerging] = useState(false);
  const wasSignedIn = useRef(isSignedIn);

  const mergeCartItems = useCallback(async () => {
    if (!isLoaded || !isSignedIn || isMerging) return;

    setIsMerging(true);
    try {
      const itemsToMerge: CartItem[] = localCartItems.map((item) => ({
        id: item.id || "",
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
      }));

      await axiosInstance.patch<ApiResponse>("/cart/sync", { items: itemsToMerge });
      const { data } = await axiosInstance.get<ApiResponse<{ cart: { items: CartItem[] } }>>("/cart");
      setItems((data?.data?.cart?.items || [])?.map((item) => ({ product: item.product, variant: item.variant, quantity: item.quantity, id: item.id })));

    } catch (error) {
      console.error("Error merging cart items:", error);
    } finally {
      setIsMerging(false);
    }
  }, [isLoaded, isSignedIn, localCartItems, isMerging, setItems]);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && !wasSignedIn.current) {
      mergeCartItems();
    }

    if (!isSignedIn && wasSignedIn.current) {
      setItems([]);
      toast.info("Cart cleared due to sign-out.");
    }

    wasSignedIn.current = isSignedIn;
  }, [isLoaded, isSignedIn, mergeCartItems, setItems]);

  return null;
};

export default MergeCart;