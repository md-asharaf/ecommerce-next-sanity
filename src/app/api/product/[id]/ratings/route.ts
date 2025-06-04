import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
    request: Request,
    {
        params,
        searchParams,
    }: {
        params: Promise<{ id: string }>;
        searchParams: Promise<{ page: string; limit: string }>;
    }
) => {
    try {
        const { id } = await params;
        const { page = 1, limit = 10 } = await searchParams;
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const ratings = await prisma.rating.findMany({
            where: {
                productId: id,
            },
            skip,
            take,
        });
        return NextResponse.json(
            {
                message: "ratings retrieved successfully for productId " + id,
                data: { ratings },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching ratings:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
