"use server";
import { PaginationResult } from "@/hooks/use-pagination";
import { ApiResponse, axiosInstance } from "@/lib/axios";
import { ElasticProduct } from "@/lib/elasticSearch";

export const searchProducts = async (
    searchParam: string,
    page: number = 1,
    limit: number = 10
): Promise<PaginationResult<ElasticProduct>> => {
    try {
        const { data } = await axiosInstance.get<
            ApiResponse<{
                total: number;
                results: ElasticProduct[];
                page: number;
                limit: number;
            }>
        >(`/elasticsearch`, {
            params: {
                q: searchParam,
                page,
                limit,
            },
        });
        return {
            items: data.data?.results || [],
            totalPages: Math.ceil((data.data?.total || 0) / limit),
            totalCount: data.data?.total || 0,
        };
    } catch (error) {
        console.error("Error searching products by name:", error);
        return {
            items: [],
            totalPages: 0,
            totalCount: 0,
        };
    }
};
