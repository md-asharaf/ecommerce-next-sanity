import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                customer: true,
                shippingAddress: true,
            },
        });
        return NextResponse.json({ data: { order } }, { status: 200 });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};

export const PATCH = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;
        const { status } = await req.json();
        if (!status) {
            return NextResponse.json(
                { message: "Status is required" },
                { status: 400 }
            );
        }
        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });
        return NextResponse.json(
            {
                data: { order },
                message: "Order status updated successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
