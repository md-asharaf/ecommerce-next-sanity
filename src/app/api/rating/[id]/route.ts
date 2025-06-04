import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await currentUser();
        const { id: ratingId } = await params;
        if (!ratingId) {
            return NextResponse.json(
                {
                    message: "Rating ID is required",
                },
                { status: 400 }
            );
        }

        const rating = await prisma.rating.findUnique({
            where: {
                id: ratingId,
            },
        });

        if (rating?.customerId !== user?.id) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const deletedRating = await prisma.rating.delete({
            where: {
                id: ratingId,
            },
        });

        return NextResponse.json(
            {
                message: "Rating deleted successfully",
                data: {
                    rating: deletedRating,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting rating", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};

export const PATCH = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await currentUser();
        const { id: ratingId } = await params;
        const { rating, review } = await req.json();
        const existingRating = await prisma.rating.findUnique({
            where: {
                id: ratingId,
            },
        });

        if (!existingRating) {
            return NextResponse.json(
                {
                    message: "Rating not found",
                },
                { status: 404 }
            );
        }

        if (existingRating.customerId !== user?.id) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        if (rating) {
            if (rating < 1 || rating > 5) {
                return NextResponse.json(
                    {
                        message: "rating must be between 1 and 5",
                    },
                    { status: 400 }
                );
            }
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

        const updatedRating = await prisma.rating.update({
            where: {
                id: ratingId,
            },
            data: {
                rating: rating ?? existingRating.rating,
                review,
            },
        });

        return NextResponse.json(
            {
                message: "Rating updated successfully",
                data: { rating: updatedRating },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating rating", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
