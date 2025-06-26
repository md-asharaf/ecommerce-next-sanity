import { SearchProducts } from "@/components/search/search-products";
import { getAllBrands } from "@/sanity/lib/brand/getAllBrands";
import { searchProducts } from "@/sanity/lib/product/searchProducts";
import { redirect } from "next/navigation";

const SearchPage = async ({ searchParams }: {
    searchParams: Promise<{
        query
        : string
    }>
}) => {
    const { query } = await searchParams;
    if (!query || query.trim() === "") {
        redirect("/")
    }
    const { items: brands } = await getAllBrands();
    const { items: products, totalCount, totalPages } = await searchProducts(query);
    return <SearchProducts brands={brands} categories={[]} products={products} />

}

export default SearchPage