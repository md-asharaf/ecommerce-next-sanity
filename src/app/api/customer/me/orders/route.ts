import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request:NextRequest) => {
    try {        
        console.log("in GET /api/customer/me/orders");
        const searchParams = request.nextUrl.searchParams;
        const { page = 1, limit = 10 } = Object.fromEntries(
            searchParams.entries()
        );
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const user = await currentUser();
        const orders = await prisma.order.findMany({
            where: { customerId: user?.id },
            skip,
            take,
            // include: {
            //     items: true,
            //     shippingAddress: true,
            //     // _count: true,
            // },
        });
        return NextResponse.json({ data: { orders } }, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
