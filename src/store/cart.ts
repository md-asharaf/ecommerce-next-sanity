import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Variant } from "../../sanity.types";

export interface CartItem {
    id?: string;
    product: Product;
    variant?: Variant;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    setItems: (items: CartItem[]) => void;
    addItem: (
        product: Product,
        variant?: Variant,
        quantity?: number,
        id?: string
    ) => void;
    removeItem: (
        productId: string,
        variantId?: string,
        quantity?: number
    ) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    getItemCount: (productId: string, variantId?: string) => number;
}

const findCartItem = (
    items: CartItem[],
    productId: string,
    variantId?: string
) => {
    return items.find(
        (item) =>
            item.product._id === productId &&
            (!variantId || item.variant?._id === variantId)
    );
};

const calculateItemPrice = (item: CartItem): number => {
    return (
        item.variant?.discountedPrice ??
        item.product.discountedPrice ??
        item.product.originalPrice ??
        0
    );
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            setItems: (items) => {
                set({ items });
            },
            addItem: (
                product: Product,
                variant?: Variant,
                quantity: number = 1,
                id?: string
            ) => {
                console.log("Adding item to cart:");
                set((state) => {
                    const existingItem = findCartItem(
                        state.items,
                        product._id,
                        variant?._id
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product._id === product._id &&
                                (!variant || item.variant?._id === variant._id)
                                    ? {
                                          ...item,
                                          quantity: item.quantity + quantity,
                                          id,
                                      }
                                    : { ...item, id }
                            ),
                        };
                    }

                    return {
                        items: [
                            ...state.items,
                            { product, variant, quantity, id },
                        ],
                    };
                });
            },

            removeItem: (
                productId: string,
                variantId?: string,
                quantity = 1
            ) => {
                set((state) => ({
                    items: state.items
                        .map((item) =>
                            item.product._id === productId &&
                            (!variantId || item.variant?._id === variantId)
                                ? { ...item, quantity: item.quantity - quantity }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                }));
            },

            clearCart: () => set({ items: [] }),

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) =>
                        total + calculateItemPrice(item) * item.quantity,
                    0
                );
            },

            getTotalItems: () => {
                return get().items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            },

            getItemCount: (productId: string, variantId?: string) => {
                return (
                    findCartItem(get().items, productId, variantId)?.quantity ??
                    0
                );
            },
        }),
        {
            name: "cart-store",
        }
    )
);
