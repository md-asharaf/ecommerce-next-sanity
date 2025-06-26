import { razorpay } from ".";

export const createRazorpayRefund = async (
    paymentId: string,
    reason: string
): Promise<any> => {
    const refund = await razorpay.payments.refund(paymentId, {
        notes: {
            reason: reason,
        },
    });
    console.log("Refund created:", refund);
    return refund || null;
};
