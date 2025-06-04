import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { productId, variantId } = body;
        if (!productId) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }
        const user = await currentUser();

        const wishlist = await prisma.wishlist.create({
            data: {
                customerId: user?.id!,
                productId,
                variantId,
            },
        });

        return NextResponse.json({ data: { wishlist } }, { status: 201 });
    } catch (error) {
        console.error("Error creating wishlist", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
