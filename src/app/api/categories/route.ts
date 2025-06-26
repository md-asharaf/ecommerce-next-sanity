import { getAllCategories } from "@/sanity/lib/category/getAllCategories";
import { searchParamsSchema } from "@/validation";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
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
    const {items,totalCount,totalPages} = await getAllCategories(page, limit);
    return NextResponse.json(
        {
            message: "Categories retrieved successfully",
            data: {
                categories:items,
                totalCount,
                totalPages,
            },
        },
        { status: 200 }
    );

}