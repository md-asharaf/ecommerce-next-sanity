import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const user = await currentUser();
        const body = await req.json();
        const { country, city, fullName, phone, state, street, postalCode } =
            body;
        if (
            !country ||
            !city ||
            !fullName ||
            !phone ||
            !state ||
            !street ||
            !postalCode
        ) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }
        const address = await prisma.address.create({
            data: {
                customerId: user?.id!,
                country,
                city,
                fullName,
                phone,
                state,
                street,
                postalCode,
            },
        });

        return NextResponse.json({ data: { address } }, { status: 201 });
    } catch (error) {
        console.error("Error creating address", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
