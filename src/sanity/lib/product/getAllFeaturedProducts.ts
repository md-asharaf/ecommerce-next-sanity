"use server";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllFeaturedProducts = async (
    page?: number,
    limit?: number
) => {
    const start = ((page ?? 1) - 1) * (limit ?? 10);
    const end = start + (limit ?? 10);
    const FEATURED_PRODUCTS_QUERY = defineQuery(
        `*[_type == "product" && isFeatured == true] | order(_createdAt desc)[$start...$end]{
            ...,
            category->{_id, name, slug, image},
            brand->{_id, name, slug, logo}
        }`
    );
    const COUNT_QUERY = defineQuery(
        `count(*[_type == "product" && isFeatured == true])`
    );

    try {
        const [products, totalCount] = await Promise.all([
            sanityFetch({
                query: FEATURED_PRODUCTS_QUERY,
                params: { start, end },
            }),
            sanityFetch({
                query: COUNT_QUERY,
            }),
        ]);

        return {
            items: products.data || [],
            totalCount: totalCount.data || 0,
            totalPages: Math.ceil((totalCount.data || 0) / (limit ?? 10)),
        };
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return { items: [], totalCount: 0, totalPages: 0 };
    }
};
