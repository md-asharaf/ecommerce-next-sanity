import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

const BASE_PRODUCT_QUERY = defineQuery(`
  *[_type == "product" && _id == $productId][0]{
    ...,
    category->,
    brand->
  }
`);

export const getProductById = async (productId: string) => {
    try {
        const product = await sanityFetch({
            query: BASE_PRODUCT_QUERY,
            params: { productId },
        });

        return product.data || null;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return null;
    }
};
