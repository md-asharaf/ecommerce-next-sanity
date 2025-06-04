import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { searchParams }: { searchParams: Promise<{ page: string; limit: string }> }
) => {
    try {
        const { page = 1, limit = 5 } = await searchParams;
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const user = await currentUser();
        const payments = await prisma.payment.findMany({
            where: { customerId: user?.id },
            skip,
            take,
        });
        return NextResponse.json({ data: { payments } }, { status: 200 });
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
