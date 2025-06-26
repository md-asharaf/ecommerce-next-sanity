import prisma from "@/lib/prisma";
import { getProductById } from "@/sanity/lib/product/getProductById";
import { searchParamsSchema } from "@/validation";
import { NextRequest, NextResponse } from "next/server";

// GET best-selling products from order items
export const GET = async (request: NextRequest) => {
    try {
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

        // Get all distinct productIds
        const allGrouped = await prisma.item.groupBy({
            by: ["productId"],
            where: {
                productId: {
                    not: undefined,
                },
            },
        });

        const totalCount = allGrouped.length;

        // Get paginated best-selling product counts
        const paginatedGrouped = await prisma.item.groupBy({
            by: ["productId"],
            _count: {
                productId: true,
            },
            where: {
                productId: {
                    not: undefined,
                },
            },
            orderBy: {
                _count: {
                    productId: "desc",
                },
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        // Get product details, rating, and review info
        const products = await Promise.all(
            paginatedGrouped.map(async (item) => {
                try {
                    const product = await getProductById(item.productId);

                    if (!product) {
                        return {
                            totalCount: item._count.productId,
                            product: undefined,
                        };
                    }

                    const [ratingAggregate, reviewsCount] = await Promise.all([
                        prisma.rating.aggregate({
                            where: { productId: item.productId },
                            _avg: { rating: true },
                            _count: { rating: true },
                        }),
                        prisma.rating.count({
                            where: {
                                productId: item.productId,
                                review: {
                                    not: undefined,
                                },
                            },
                        }),
                    ]);

                    return {
                        totalCount: item._count.productId,
                        product: {
                            ...product,
                            rating: {
                                avg: ratingAggregate._avg.rating ?? 0,
                                count: ratingAggregate._count.rating ?? 0,
                                reviewsCount: reviewsCount,
                            },
                        },
                    };
                } catch (err) {
                    console.error(
                        "Error loading product:",
                        item.productId,
                        err
                    );
                    return {
                        totalCount: item._count.productId,
                        product: undefined,
                    };
                }
            })
        );

        return NextResponse.json(
            {
                data: {
                    products,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                },
                message: "Best selling products fetched successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching best selling products:", error);
        return NextResponse.json(
            {
                message: "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
};
