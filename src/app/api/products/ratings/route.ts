import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{ id: string }>;
    }
) => {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const { page = 1, limit = 10 } = Object.fromEntries(
            searchParams.entries()
        );
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const ratings = await prisma.rating.findMany({
            where: {
                productId: id,
            },
            include: {
                customer: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
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
