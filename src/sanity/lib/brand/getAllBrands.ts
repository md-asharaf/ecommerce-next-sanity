import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllBrands = async (page: number = 1, limit: number = 10) => {
    const start = (page - 1) * limit;
    const end = start + limit;

    const ALL_BRANDS_QUERY = defineQuery(`
        {
            "items": *[_type == "brand"] | order(name asc) [${start}...${end}],
            "totalCount": count(*[_type == "brand"])
        }
    `);

    try {
        const result = await sanityFetch({
            query: ALL_BRANDS_QUERY,
            params: { start, end }
        });
        const data = result?.data || {};
        return {
            items: data.items || [],
            totalCount: data.totalCount || 0,
            totalPages: Math.ceil((data.totalCount || 0) / limit),
        };
    } catch (error) {
        console.error("Error fetching all brands: ", error);
        return {
            items: [],
            totalCount: 0,
            totalPages: 0,
        };
    }
};
