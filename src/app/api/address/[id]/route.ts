import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;
        const user = await currentUser();

        const address = await prisma.address.findUnique({
            where: { id },
        });
        if (address?.customerId !== user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        return NextResponse.json({ data: { address } }, { status: 200 });
    } catch (error) {
        console.error("Error fetching address", error);
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
        const user = await currentUser();

        const { country, city, fullName, phone, state, street, postalCode } =
            await req.json();
        const address = await prisma.address.findUnique({ where: { id } });

        if (address?.customerId !== user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const updatedAddress = await prisma.address.update({
            where: { id },
            data: {
                ...(country && { country }),
                ...(city && { city }),
                ...(fullName && { fullName }),
                ...(phone && { phone }),
                ...(state && { state }),
                ...(street && { street }),
                ...(postalCode && { postalCode }),
            },
        });
        return NextResponse.json(
            {
                data: { address: updatedAddress },
                message: "Address updated successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error updating address", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};

export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await currentUser();
        const { id } = await params;
        const address = await prisma.address.findUnique({
            where: {
                id,
            },
        });

        if (address?.customerId !== user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const deletedAddress = await prisma.address.delete({
            where: {
                id,
            },
        });

        return NextResponse.json(
            {
                data: { address: deletedAddress },
                message: "Address deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting address", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
