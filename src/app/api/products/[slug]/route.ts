import prisma from "@/lib/prisma";
import { getProductBySlug } from "@/sanity/lib/product/getProductBySlug";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
        return NextResponse.json(
            {
                message: "Product not found",
            },
            { status: 404 }
        );
    }
    // fetch rating
    const [ratingAggregate, reviewsCount] = await Promise.all([
        prisma.rating.aggregate({
            where: {
                productId: product._id,
            },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        }),
        prisma.rating.count({
            where: {
                productId: product._id,
                review: {
                    not: undefined,
                },
            },
        }),
    ]);
    return NextResponse.json(
        {
            data: {
                product: {
                    ...product,
                    rating: {
                        avg: ratingAggregate._avg.rating ?? 0,
                        count: ratingAggregate._count.rating ?? 0,
                        reviewsCount: reviewsCount,
                    },
                },
            },
            message: "Product retrieved successfully",
        },
        { status: 200 }
    );
};
