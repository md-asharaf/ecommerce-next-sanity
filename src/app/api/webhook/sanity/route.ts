import { client } from "@/lib/elasticSearch";
import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;
const SEARCH_INDEX = process.env.ELASTICSEARCH_INDEX;

export async function POST(request: NextRequest) {
    try {
        try {
            if (!WEBHOOK_SECRET) {
                return NextResponse.json(
                    {
                        message: "Webhook secret not set",
                    },
                    { status: 500 }
                );
            }
            if (!SEARCH_INDEX) {
                return NextResponse.json(
                    {
                        message: "Search index not set",
                    },
                    { status: 500 }
                );
            }
            const signature = request.headers.get(SIGNATURE_HEADER_NAME);
            const operation = request.headers.get("sanity-operation");
            const rawBody = await request.text();
            if (
                !(await isValidSignature(rawBody, signature!, WEBHOOK_SECRET))
            ) {
                return NextResponse.json(
                    {
                        message: "Invalid signature",
                    },
                    { status: 401 }
                );
            }
            const body = JSON.parse(rawBody);
            const { _id, ...document } = body;
            if (!SEARCH_INDEX) {
                return NextResponse.json(
                    { message: "Index not set" },
                    {
                        status: 500,
                    }
                );
            }
            if (operation === "create" || operation === "update") {
                await client.index({
                    index: SEARCH_INDEX,
                    id: _id,
                    document,
                });
                return NextResponse.json(
                    { message: "Product indexed" },
                    {
                        status: 200,
                    }
                );
            } else if (operation === "delete") {
                await client.delete({
                    index: SEARCH_INDEX,
                    id: _id,
                });
                return NextResponse.json(
                    { message: "Product deleted" },
                    {
                        status: 200,
                    }
                );
            }
            return NextResponse.json(
                { message: "Unknown operation" },
                {
                    status: 400,
                }
            );
        } catch (error: any) {
            console.error("Webhook error:", error);
            return NextResponse.json(
                { message: "Internal error" },
                {
                    status: 500,
                }
            );
        }
    } catch (error: any) {
        console.error("Outer webhook error:", error);
        return NextResponse.json(
            { message: "Internal error" },
            {
                status: 500,
            }
        );
    }
}
