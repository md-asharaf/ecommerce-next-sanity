import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const user = await currentUser();
        const { productId, rating, review } = await req.json();

        if (!productId || !rating) {
            return NextResponse.json(
                {
                    message: "productId and rating are required",
                },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                {
                    message: "rating must be between 1 and 5",
                },
                {
                    status: 400,
                }
            );
        }

        if (review) {
            if (!review.title || !review.description) {
                return NextResponse.json(
                    {
                        message: "review title and description are required",
                    },
                    { status: 400 }
                );
            }
        }

        const createdRating = await prisma.rating.create({
            data: {
                productId,
                rating,
                customerId: user?.id!,
                review,
            },
        });

        return NextResponse.json(
            {
                message: "Rating created successfully",
                data: { rating: createdRating },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating rating:", error);
        return NextResponse.json(
            {
                message: "An error occurred while creating the rating",
            },
            { status: 500 }
        );
    }
};
