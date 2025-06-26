import prisma from "@/lib/prisma";
import { getProductsByCategory } from "@/sanity/lib/product/getProductsByCategory";
import { searchParamsSchema } from "@/validation";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Validate search parameters
    const parsedParams = searchParamsSchema.safeParse(
        Object.fromEntries(searchParams.entries())
    );

    if (!parsedParams.success) {
        return NextResponse.json(
            {
                message: "Invalid search parameters",
                errors: parsedParams.error.issues,
            },
            { status: 400 }
        );
    }

    const { page = 1, limit = 10 } = parsedParams.data;

    try {
        const {
            items: products,
            totalCount,
            totalPages,
        } = await getProductsByCategory(slug, page, limit);

        // Attach rating info to each product
        const productsWithRatings = await Promise.all(
            products.map(async (product) => {
                const [ratingAggregate, reviewsCount] = await Promise.all([
                    prisma.rating.aggregate({
                        where: { productId: product._id },
                        _avg: { rating: true },
                        _count: { rating: true },
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

                return {
                    ...product,
                    rating: {
                        avg: ratingAggregate._avg.rating ?? 0,
                        count: ratingAggregate._count.rating ?? 0,
                        reviewsCount: reviewsCount,
                    },
                };
            })
        );

        return NextResponse.json(
            {
                data: {
                    products: productsWithRatings,
                    totalCount,
                    totalPages,
                },
                message:"Category Products fetched successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching category details:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};
