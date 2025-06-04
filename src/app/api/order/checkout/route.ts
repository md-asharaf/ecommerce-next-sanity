import { Item } from "@/generated/prisma";
import { getActiveSaleByCouponCode } from "@/sanity/lib/sale/getActiveSaleByCouponCode";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Sale } from "../../../../../sanity.types";
import prisma from "@/lib/prisma";
import { createRazorpayOrder } from "@/actions/createRazorpayOrder";

export const POST = async (request: Request) => {
    try {
        const user = await currentUser();
        const { items, shippingAddress, couponCode } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { message: "items can not be empty" },
                { status: 400 }
            );
        }
        if (!shippingAddress) {
            return NextResponse.json(
                { message: "shippingAddress is required" },
                { status: 400 }
            );
        }

        let { totalAmount, discountAmount } = items.reduce(
            (
                acc: {
                    totalAmount: number;
                    discountAmount: number;
                },
                item: Item
            ) => {
                const { originalPrice, quantity, unitPrice } = item;
                acc.totalAmount += originalPrice * quantity;
                acc.discountAmount += (originalPrice - unitPrice) * quantity;
                return acc;
            },
            {
                totalAmount: 0,
                discountAmount: 0,
            }
        );

        let finalAmount = totalAmount - discountAmount;
        let couponId = null;

        if (couponCode) {
            const sale = (await getActiveSaleByCouponCode(couponCode)) as Sale;
            if (!sale) {
                return NextResponse.json(
                    { message: "Invalid coupon code" },
                    { status: 400 }
                );
            }

            const {
                _id,
                discountValue,
                discountType,
                isActive,
                startDate,
                expiryDate,
                minOrderAmount,
            } = sale;
            couponId = _id;

            const isExpired =
                new Date() > new Date(expiryDate) ||
                new Date() < new Date(startDate) ||
                !isActive;
            if (isExpired) {
                return NextResponse.json(
                    { message: "Coupon code is expired" },
                    { status: 400 }
                );
            }

            if (finalAmount < minOrderAmount) {
                return NextResponse.json(
                    { message: "Coupon code is not applicable on this order." },
                    { status: 400 }
                );
            }

            finalAmount -=
                discountType === "percentage"
                    ? (discountValue * finalAmount) / 100
                    : discountValue;
            discountAmount +=
                discountType === "percentage"
                    ? (discountValue * totalAmount) / 100
                    : discountValue;
        }

        const taxAmount = finalAmount > 1000 ? finalAmount * 0.18 : 0;
        const shippingCost = finalAmount > 500 ? 0 : 50;
        finalAmount += taxAmount + shippingCost;

        const orderPayload = {
            customerId: user?.id,
            totalAmount,
            discountAmount,
            finalAmount,
            shippingAddressId: shippingAddress.id,
            shippingCost,
            taxAmount,
            couponId,
        };

        const order = await prisma.order.create({
            data: {
                finalAmount: orderPayload.finalAmount,
                totalAmount: orderPayload.totalAmount as number,
                discountAmount: orderPayload.discountAmount as number,
                shippingCost: orderPayload.shippingCost as number,
                taxAmount: orderPayload.taxAmount,
                shippingAddressId: orderPayload.shippingAddressId,
                customerId: user?.id as string,
                couponId: orderPayload.couponId,
            },
        });

        await Promise.all(
            items.map(async (item: Item) => {
                await prisma.item.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        orderId: order.id,
                    },
                });
            })
        );

        const razorpayOrder = await createRazorpayOrder(
            finalAmount,
            order.id,
            user?.fullName as string
        );
        if (!razorpayOrder) {
            return NextResponse.json(
                { message: "Failed to create Razorpay order" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "Order created successfully",
                data: {
                    orderId: order.id,
                    razorpayOrderId: razorpayOrder.id,
                    amount: finalAmount,
                    currency: razorpayOrder.currency,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in checkout process:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
