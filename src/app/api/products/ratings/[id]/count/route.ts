import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id: productId } = await params;
        if (!productId) {
            return NextResponse.json(
                { message: "productId is required" },
                { status: 400 }
            );
        }

        const ratingCount = await prisma.rating.count({
            where: {
                productId,
            },
        });
        const reviewCount = await prisma.rating.count({
            where: {
                productId,
                review: {
                    not: Prisma.JsonNull,
                },
            },
        });
        const ratingAverage = await prisma.rating.aggregate({
            _avg: {
                rating: true,
            },
            where: {
                productId,
            },
        });
        return NextResponse.json(
            {
                data: {
                    ratingCount,
                    reviewCount,
                    ratingAverage: ratingAverage._avg.rating || 0,
                },
                message: "Rating count retrieved successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving rating and review count", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
