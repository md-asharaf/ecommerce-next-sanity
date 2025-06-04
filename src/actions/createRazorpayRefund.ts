"use server";
import { razorpay } from "@/lib/razorpay";

export const createRazorpayRefund = async (
    paymentId: string,
    amount: number,
    reason: string
): Promise<any> => {
    const refund = await razorpay.payments.refund(paymentId, {
        amount: Math.round(amount * 100),
        notes: {
            reason,
        },
    });
    console.log("Refund created:", refund);
    return refund || null;
};
