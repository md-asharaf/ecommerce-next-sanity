import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { OrderStatus, RefundStatus } from "../../../../../../generated/prisma";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    try {
        if (!RAZORPAY_WEBHOOK_SECRET) {
            console.error("RAZORPAY_WEBHOOK_SECRET is not defined.");
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 }
            );
        }

        let body: string;
        let signature: string | null;
        let event: any;

        try {
            body = await req.text();
            signature = req.headers.get("x-razorpay-signature");

            if (!signature) {
                console.warn(
                    "Webhook received without x-razorpay-signature header."
                );
                return NextResponse.json(
                    { message: "Signature header missing" },
                    { status: 400 }
                );
            }

            const expectedSignature = crypto
                .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
                .update(body)
                .digest("hex");

            if (signature !== expectedSignature) {
                console.warn("Invalid Razorpay webhook signature.");
                return NextResponse.json(
                    { message: "Invalid signature" },
                    { status: 400 }
                );
            }

            event = JSON.parse(body);
            console.log(
                "Received Razorpay webhook event:",
                event.event,
                "for refund ID:",
                event.payload?.refund?.entity?.id
            );
        } catch (error) {
            console.error(
                "Error parsing webhook body or verifying signature:",
                error
            );
            return NextResponse.json(
                { message: "Invalid request or processing error" },
                { status: 400 }
            );
        }

        if (
            event.event === "refund.processed" ||
            event.event === "refund.failed"
        ) {
            try {
                const razorpayRefundId = event.payload?.refund?.entity?.id;
                if (!razorpayRefundId) {
                    console.error("Missing refund ID in webhook payload");
                    return NextResponse.json(
                        { message: "Missing refund ID in payload" },
                        { status: 400 }
                    );
                }

                const refundStatus: RefundStatus =
                    event.event === "refund.processed" ? "COMPLETED" : "FAILED";

                // Update refund record
                const refund = await prisma.refund.update({
                    where: {
                        razorpayRefundId,
                    },
                    data: {
                        status: refundStatus,
                    },
                });

                console.log(
                    `Refund record ${refund.id} updated with status ${refundStatus}`
                );

                // Update order status to REFUNDED if refund was successful
                if (refundStatus === "COMPLETED") {
                    await prisma.order.update({
                        where: { id: refund.orderId },
                        data: {
                            status: "REFUNDED" as OrderStatus,
                        },
                    });
                    console.log(
                        `Order ${refund.orderId} status updated to REFUNDED`
                    );
                }
            } catch (dbError) {
                console.error(
                    "Database operation failed for webhook event:",
                    event.event,
                    "Error:",
                    dbError
                );
                return NextResponse.json(
                    {
                        message:
                            "Internal server error during database operation",
                    },
                    { status: 500 }
                );
            }
        } else {
            // Log other events that you might not be processing currently
            console.log(
                "Received unhandled Razorpay webhook event:",
                event.event
            );
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Unexpected error in webhook handler:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
