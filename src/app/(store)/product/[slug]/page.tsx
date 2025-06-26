import { getVariantsByProductId } from "@/sanity/lib/variant/getVariantsByProductId";
import { Variant } from "../../../../../sanity.types";
import ProductDetails from "@/components/product-details";
import { ApiResponse, axiosInstance } from "@/lib/axios";
import { ExpandedProduct } from "@/types";
import { Wishlist } from "@prisma/client";


export default async function ProductPage({ params }: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return <div className="text-center text-red-500">Product not found</div>;
  }

  let product: ExpandedProduct | null = null;
  try {
    const { data } = await axiosInstance.get<ApiResponse<{ product: ExpandedProduct }>>(
      `/products/${encodeURIComponent(slug)}`
    );
    product = data?.data?.product ?? null;
  } catch (error) {
  }

  if (!product) {
    return <div className="text-center text-red-500">Product not found</div>;
  }

  let variants: Variant[] = [];
  if (product.hasVariants) {
    try {
      variants = await getVariantsByProductId(product._id);
    } catch (error) {
      variants = [];
    }
  }

  let wishlist: Wishlist | null = null;
  try {
    const { data } = await axiosInstance.get<ApiResponse<{ wishlist: Wishlist }>>(
      `/wishlist/is-added/${product._id}`
    );
    wishlist = data?.data?.wishlist ?? null;
  } catch (error) {
    wishlist = null;
  }

  return (
    <ProductDetails product={product} variants={variants} isWishlisted={!!wishlist} wishlistId={wishlist?.id} />
  );
}