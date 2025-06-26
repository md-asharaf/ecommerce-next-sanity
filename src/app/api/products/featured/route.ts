import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "../../../../../sanity.types";
import { getAllFeaturedProducts } from "@/sanity/lib/product/getAllFeaturedProducts";
import { searchParamsSchema } from "@/validation";

export const GET = async (req: NextRequest) => {
    try {
        const searchParams = req.nextUrl.searchParams;

        // Validate and parse search parameters
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

        const { page=1, limit=10 } = parsedParams.data;

        // Use the actual page and limit from query params
        const {
            items: featuredProducts,
            totalCount,
            totalPages,
        } = await getAllFeaturedProducts(page, limit);

        // Fetch ratings for all products in parallel
        const productsWithRatings = await Promise.all(
            featuredProducts.map(async (product: Product) => {
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
                message: "Featured products fetched successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error fetching featured products", error);
        return NextResponse.json(
            { message: "Failed to fetch featured products" },
            { status: 500 }
        );
    }
};
