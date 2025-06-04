import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const {
            productId,
            variantId,
            quantity,
            cartId,
            unitPrice,
            originalPrice,
        } = await req.json();

        if (!productId || !quantity || !cartId || !unitPrice) {
            return NextResponse.json(
                {
                    message:
                        "Product ID, quantity , cartId and unitPrice are required",
                },
                { status: 400 }
            );
        }

        const item = await prisma.item.create({
            data: {
                productId,
                variantId,
                quantity,
                unitPrice,
                cartId,
                originalPrice,
            },
        });
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
