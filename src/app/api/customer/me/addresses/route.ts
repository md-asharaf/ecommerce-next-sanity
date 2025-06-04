import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const user = await currentUser();
        const addresses = await prisma.address.findMany({
            where: { customerId: user?.id },
        });

        return NextResponse.json({ data: { addresses } }, { status: 200 });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
