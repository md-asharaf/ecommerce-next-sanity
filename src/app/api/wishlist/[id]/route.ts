import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;
        const user = await currentUser();
        const wishlist = await prisma.wishlist.findUnique({
            where: {
                id,
            },
        });

        if (wishlist?.customerId !== user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const deletedWishlist = await prisma.wishlist.delete({
            where: {
                id,
            },
        });

        return NextResponse.json(
            {
                message: "wishlist deleted successfully",
                data: {
                    wishlist: deletedWishlist,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting wishlist", error);
        return NextResponse.json(
            { message: "Internal error" },
            { status: 500 }
        );
    }
};
