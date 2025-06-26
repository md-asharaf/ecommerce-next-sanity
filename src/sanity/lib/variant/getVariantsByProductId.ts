import { sanityFetch } from "../live";

export const getVariantsByProductId = async (productId: string) => {
    const VARIANTS_BY_PRODUCT_QUERY = `
        *[_type == "variant" && product._ref == $productId] {
            _id,
            title,
            price,
            stock,
            product-> {
                _id,
                title
            }
        }
    `;

    try {
        const variants = await sanityFetch({
            query: VARIANTS_BY_PRODUCT_QUERY,
            params: { productId },
        });
        return variants.data || [];
    } catch (error) {
        console.error("Error fetching variants by product ID:", error);
        return [];
    }
};
