"use server"
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { PaginationResult } from "@/hooks/use-pagination";
import { Review } from "../../../../sanity.types";

export const getReviewsBySlug = async (
    slug: string,
    page: number = 1,
    limit: number = 10
): Promise<PaginationResult<Review>> => {
    const REVIEWS_BY_SLUG_QUERY = defineQuery(`
        {
            "items": *[_type == "review" && product->slug.current == $slug] | order(createdAt desc) [$start...$end],
            "totalCount": count(*[_type == "review" && product->slug.current == $slug])
        }
    `);

    try {
        const start = (page - 1) * limit;
        const end = start + limit;

        const result = await sanityFetch({
            query: REVIEWS_BY_SLUG_QUERY,
            params: {
                slug,
                start,
                end,
            },
        });

        const items = result.data?.items || [];
        const totalCount = result.data?.totalCount || 0;
        const totalPages = Math.ceil(totalCount / limit);

        return {
            items,
            totalPages,
            totalCount,
        };
    } catch (error) {
        console.error("Error fetching reviews by slug:", error);
        return {
            items: [],
            totalPages: 0,
            totalCount: 0,
        };
    }
};
