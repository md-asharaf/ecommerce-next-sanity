import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    request: NextRequest,
) => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const { page = 1, limit = 10 } = Object.fromEntries(
            searchParams.entries()
        );
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const user = await currentUser();
        const wishlists = await prisma.wishlist.findMany({
            where: { customerId: user?.id },
            skip,
            take,
        });
        return NextResponse.json({ data: { wishlists } }, { status: 200 });
    } catch (error) {
        console.error("Error fetching wishlists:", error);
        return NextResponse.json(
            {
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
};
