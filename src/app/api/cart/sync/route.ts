import prisma from "@/lib/prisma";
import { CartItem } from "@/store/cart";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request) => {
    try {
        const user = await currentUser();

        const body = await request.json();
        const { items } = body as {
            items: CartItem[];
        };
        console.log("Merging cart items:", items);
        // Validate cartId and items
        if (!Array.isArray(items)) {
            return NextResponse.json(
                { message: "Invalid request data" },
                { status: 400 }
            );
        }
        if (!user || !user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        // fetch existing cart
        const cart = await prisma.cart.upsert({
            where: {
                customerId: user.id,
            },
            create: {
                customerId: user.id,
            },
            update: {},
            include: {
                items: true,
            },
        });
        // Prepare bulk operations
        const updates: { id: string; quantity: number }[] = [];
        const creates: {
            productId: string;
            variantId?: string;
            quantity: number;
            cartId: string;

            unitPrice: number;
            originalPrice: number;
        }[] = [];

        // Group items into updates and creates
        for (const item of items) {
            const existingItem = cart.items.find((i) => {
                return (
                    i.productId === item.product?._id &&
                    (!item.variant?._id || i.variantId === item.variant?._id)
                );
            });
            if (existingItem) {
                updates.push({
                    id: existingItem.id,
                    quantity: Math.max(existingItem.quantity, item.quantity),
                });
            } else {
                creates.push({
                    productId: item.product?._id,
                    variantId: item.variant?._id,
                    quantity: item.quantity,
                    cartId: cart.id,
                    unitPrice:
                        item.variant?.discountedPrice ||
                        item.variant?.price ||
                        item.product.discountedPrice ||
                        item.product.originalPrice ||
                        0,
                    originalPrice:
                        item.variant?.price || item.product.originalPrice || 0,
                });
            }
        }

        // Execute all operations in a transaction
        await prisma.$transaction(async (tx) => {
            // Bulk update existing items
            for (const update of updates) {
                await tx.item.update({
                    where: { id: update.id },
                    data: { quantity: update.quantity },
                });
            }

            // Bulk create new items
            if (creates.length > 0) {
                await tx.item.createMany({
                    data: creates,
                });
            }
        });

        return NextResponse.json(
            { message: "cart merged successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error merging cart:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
