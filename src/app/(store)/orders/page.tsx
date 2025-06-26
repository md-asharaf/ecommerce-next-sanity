import PaginatedOrders, { PopulatedOrder } from "@/components/orders";
import { ApiResponse, axiosInstance } from "@/lib/axios";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const OrdersPage = async ({ searchParams }: { searchParams: Promise<{ page: number }> }) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/")
  }
  const { page = 1 } = await searchParams;
  const fetchOrders = async (page: number, limit: number) => {
    try {
      const { data } = await axiosInstance.get<ApiResponse<{ items: PopulatedOrder[], totalPages: number, totalCount: number }>>(`/customer/me/orders`, {
        params: {
          page,
          limit
        }
      });
      console.log("Fetched orders:", data);
      return data.data!;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { items: [], totalPages: 0, totalCount: 0 };
    }
  }
  const { items: orders, totalPages } = await fetchOrders(page, 5);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">Track and manage your orders</p>
        </div>

        <PaginatedOrders orders={orders} currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  )
}

export default OrdersPage