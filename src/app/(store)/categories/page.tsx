import { Categories } from '@/components/category/categories'
import { ApiResponse, axiosInstance } from '@/lib/axios'
import { ExpandedCategory } from '@/types'

export default async function AllCategoriesPage() {
  const { data } = await axiosInstance.get<ApiResponse<{ categories: ExpandedCategory[], totalCount: number, totalPages: number }>>(`/categories`, {
    params: {
      page: 1,
      limit: 10
    }
  })
  const categories = data?.data?.categories || []
  return (
    <Categories categories={categories} />
  )
}