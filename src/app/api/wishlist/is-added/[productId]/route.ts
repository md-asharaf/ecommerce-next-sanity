import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) => {
    try {
        console.log("in GET wishlist/is-added/[productId]/route.ts");
        const { productId } = await params;
        const user = await currentUser();
        const wishlist = await prisma.wishlist.findFirst({
            where: {
                customerId: user?.id,
                productId,
            },
        });
        return NextResponse.json(
            {
                data: {
                    wishlist,
                },
                message: "Wishlist status fetched successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking wishlist status:", error);
        return NextResponse.json(
            {
                message: "Failed to check wishlist status",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
