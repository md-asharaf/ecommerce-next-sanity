"use server"
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { PaginationResult } from "@/hooks/use-pagination";
import { ExpandedCategory } from "@/types";

export const getAllCategories = async (
    page: number = 1,
    limit: number = 10
): Promise<PaginationResult<ExpandedCategory>> => {
    // Query to get categories with productCount
    const ALL_CATEGORIES_QUERY = defineQuery(`
        *[_type == "category"] | order(name asc) [$start...$end]{
            ...,
            "productCount": count(*[_type == "product" && references(^._id)])
        }
    `);

    try {
        const start = (page - 1) * limit;
        const end = start + limit;

        const categories = await sanityFetch({
            query: ALL_CATEGORIES_QUERY,
            params: { start, end }
        });

        // Get total count
        const totalQuery = defineQuery(`count(*[_type == "category"])`);
        const total = await sanityFetch({ query: totalQuery });

        return {
            items: categories.data || [],
            totalPages: Math.ceil((total.data || 0) / limit),
            totalCount: total.data || 0
        };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return {
            items: [],
            totalPages: 0,
            totalCount: 0
        };
    }
};
