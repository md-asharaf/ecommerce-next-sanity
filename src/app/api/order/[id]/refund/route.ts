import { createRazorpayRefund } from "@/lib/razorpay/createRazorpayRefund";
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
        const razorpayRefund = await createRazorpayRefund(
            order?.payment?.id!,
            reason
        );
        if (!razorpayRefund) {
            return NextResponse.json(
                { message: "Failed to create refund request" },
                { status: 500 }
            );
        }
        const status =
            razorpayRefund.status === "processed"
                ? "COMPLETED"
                : razorpayRefund.status === "failed"
                  ? "FAILED"
                  : "APPROVED";
        // Update the refund record with Razorpay details
        await prisma.refund.update({
            where: { id: refund.id },
            data: {
                razorpayRefundId: razorpayRefund.id,
                status,
            },
        });

        return NextResponse.json(
            {
                data: { refundId: refund.id },
                message: "Refund request created successfully",
            },
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
