import { getAllBrands } from "@/sanity/lib/brand/getAllBrands";
import { getCategoryBySlug } from "@/sanity/lib/category/getCategoryBySlug";
import { ExpandedProduct } from "@/types";
import { ApiResponse, axiosInstance } from "@/lib/axios";
import { CategoryDetails } from "@/components/category/category-details";

const page = async ({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ page: number }> }) => {
  const { slug } = await params;
  const { page } = await searchParams;
  if (!slug) {
    return <div className="text-center text-red-500">Category not found</div>;
  }
  const category = await getCategoryBySlug(slug);
  const { items: brands } = await getAllBrands();
  let products: ExpandedProduct[] = [];
  try {
    const { data } = await axiosInstance.get<ApiResponse<{ products: ExpandedProduct[] }>>(`/categories/${encodeURIComponent(slug)}/products`, {
      params: {
        page: page || 1,
        limit: 10,
      },
    })
    products = data?.data?.products || [];
  } catch (error) {

  }
  return (
    <CategoryDetails category={category} brands={brands} products={products} />
  )
}

export default page