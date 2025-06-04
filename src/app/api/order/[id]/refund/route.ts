import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id: orderId } = await params;
        if (!orderId) {
            return NextResponse.json(
                { message: "Order ID is required" },
                { status: 400 }
            );
        }

        const user = await currentUser();

        const { reason } = await req.json();
        if (!reason) {
            return NextResponse.json(
                { message: "Refund reason is required" },
                { status: 400 }
            );
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });

        if (order?.customerId !== user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        // Create refund record
        const refund = await prisma.refund.create({
            data: {
                paymentId: order?.payment?.id!,
                reason,
                orderId: order?.id!,
                amount: order?.totalAmount!,
            },
        });

        // create refund request to razorpay
        

        return NextResponse.json(
            { data: refund, message: "Refund request created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error processing refund request", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
