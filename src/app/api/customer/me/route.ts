import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// get customer by id
export const GET = async (req: Request) => {
    try {
        const user = await currentUser();
        const customer = await prisma.customer.findUnique({
            where: { id: user?.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                imageUrl: true,
            },
        });
        return NextResponse.json(
            { data: { customer }, message: "customer retrieved successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching customer:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};

// update customer by id
export const PUT = async (req: Request) => {
    try {
        const user = await currentUser();
        const body = await req.json();
        const { firstName, lastName, phone, imageUrl } = body;
        if (!firstName || !lastName || !phone || !imageUrl) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }
        const updatedCustomer = await prisma.customer.update({
            where: { id: user?.id },
            data: {
                firstName,
                lastName,
                phone,
                imageUrl,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                imageUrl: true,
            },
        });

        return NextResponse.json(
            {
                data: { customer: updatedCustomer },
                message: "customer updated successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating customer:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
