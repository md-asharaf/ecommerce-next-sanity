import prisma from "@/lib/prisma";
import { getProductById } from "@/sanity/lib/product/getProductById";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 }
            );
        }
        const { items, ...rest } = cart;
        const itemsWithProductDetails = await Promise.all(
            items.map(async (item) => {
                const { productId, variantId } = item;
                const product = await getProductById(
                    productId,
                    variantId || undefined
                );
                return {
                    ...item,
                    product,
                };
            })
        );

        return NextResponse.json(
            { data: { cart: { ...rest, items: itemsWithProductDetails } } },
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
