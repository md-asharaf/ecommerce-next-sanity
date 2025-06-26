import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
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

        const {
            productId,
            variantId,
            quantity = 1,
            unitPrice,
            originalPrice,
        } = await req.json();
        if (!productId || !quantity || !unitPrice || !originalPrice) {
            return NextResponse.json(
                {
                    message: "Product ID, quantity and unitPrice are required",
                },
                { status: 400 }
            );
        }
        const existingItem = cart?.items.find(
            (item) =>
                item.productId === productId &&
                (!variantId || item.variantId === variantId)
        );
        let item;
        if (existingItem) {
            // Update the existing item quantity
            item = await prisma.item.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: existingItem.quantity + quantity,
                    unitPrice,
                    originalPrice,
                },
            });
        } else {
            item = await prisma.item.create({
                data: {
                    productId,
                    variantId,
                    quantity,
                    unitPrice,
                    originalPrice,
                    cartId: cart?.id,
                },
            });
        }

        return NextResponse.json(
            { message: "Item added to cart successfully", data: { item } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
