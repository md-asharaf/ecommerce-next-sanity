import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;
        const item = await prisma.item.findUnique({
            where: { id },
        });
        if (!item) {
            return NextResponse.json(
                { message: "Item not found" },
                { status: 404 }
            );
        }
        const deletedItem = await prisma.item.delete({
            where: { id },
        });
        if (!deletedItem) {
            return NextResponse.json(
                { message: "Failed to delete item" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            {
                message: "Item deleted successfully",
                data: {
                    item: deletedItem,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting item:", error);
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
        const { quantity, unitPrice } = await req.json();
        if (!quantity && !unitPrice) {
            return NextResponse.json(
                { message: "Quantity or unitPrice is required" },
                { status: 400 }
            );
        }
        const item = await prisma.item.findUnique({
            where: {
                id,
            },
        });
        if (!item) {
            return NextResponse.json(
                { message: "Item not found" },
                { status: 404 }
            );
        }
        const updatedItem = await prisma.item.update({
            where: {
                id: item.id,
            },
            data: {
                quantity: quantity ?? item.quantity,
                unitPrice: unitPrice ?? item.unitPrice,
            },
        });
        return NextResponse.json(
            {
                message: "Item updated successfully",
                data: { item: updatedItem },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating item:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
