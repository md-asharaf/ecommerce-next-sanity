import ProductGrid from '../product-grid'
import { ApiResponse, axiosInstance } from '@/lib/axios'
import { ExpandedProduct } from '@/types'

const FeaturedProducts = async () => {
    const { data } = await axiosInstance.get<ApiResponse<{ products: ExpandedProduct[], totalCount: number, totalPages: number }>>('/products/featured', {
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

export default FeaturedProducts