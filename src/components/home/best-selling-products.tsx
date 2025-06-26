import ProductGrid from '../product-grid'
import { ApiResponse, axiosInstance } from '@/lib/axios'
import { ExpandedProduct } from '@/types'

const BestSellingProducts = async () => {
    const { data } = await axiosInstance.get<ApiResponse<{ products: ExpandedProduct[], totalCount: number, totalPages: number }>>(`/products/best-selling`, {
        params: {
            page: 1,
            limit: 10
        }
    })
    const products = data?.data?.products || []
    return (
        <ProductGrid products={products} />
    )
}

export default BestSellingProducts