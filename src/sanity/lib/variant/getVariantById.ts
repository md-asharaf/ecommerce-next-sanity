import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getVariantById = async (variantId: string) => {
    const VARIANT_BY_ID_QUERY = defineQuery(`
        *[_type == "variant" && _id == $variantId][0]
      `);

    try {
        const variant = await sanityFetch({
            query: VARIANT_BY_ID_QUERY,
            params: { variantId },
        });
        return variant.data || null;
    } catch (error) {
        console.error("Error fetching variant by ID:", error);
        return null;
    }
};
