import prisma from "@/lib/prisma";
import { getProductById } from "@/sanity/lib/product/getProductById";
import { currentUser } from "@clerk/nextjs/server";
import { Cart, Item } from "@prisma/client";
import { NextResponse } from "next/server";
import { getVariantById } from "@/sanity/lib/variant/getVariantById";
import { CartItem } from "@/store/cart";

export interface PopulatedCart extends Cart {
    items: CartItem[];
}
export const GET = async () => {
    try {
        const user = await currentUser();
        const cart = await prisma.cart.findUnique({
            where: {
                customerId: user?.id,
            },
            include: {
                items: true,
            },
        });
        const { items, ...rest } = cart!;
        const itemsWithProductDetails = await Promise.all(
            items.map(async (item): Promise<CartItem> => {
                const { productId, variantId } = item;
                const [product, variant] = await Promise.all([
                    getProductById(productId),
                    getVariantById(variantId || ""),
                ]);
                return {
                    id: item.id,
                    product,
                    variant,
                    quantity: item.quantity,
                };
            })
        );

        return NextResponse.json(
            {
                data: {
                    cart: {
                        ...rest,
                        items: itemsWithProductDetails,
                    } as PopulatedCart,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
