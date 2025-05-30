"use client"
import { ClerkLoaded, useUser, SignInButton, UserButton, SignedIn } from "@clerk/nextjs"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Image from "next/image";
import favicon from "@/app/favicon.ico"
export const Header = () => {
    const { user } = useUser();
    const router = useRouter();
    const { items } = useCartStore();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedValue] = useDebounce(searchQuery, 500);
    useEffect(() => {
        if (debouncedValue) {
            router.push(`/search?query=${encodeURIComponent(debouncedValue)}`);
        }
    }, [debouncedValue, router]);

    const createPassKey = async () => {
        try {
            await user?.createPasskey();
        } catch (error) {
            console.log(JSON.stringify(error, null, 2))
        }
    }

    return <header className="fixed top-0 inset-x-0 flex flex-wrap justify-between items-center px-4 py-2 z-50 bg-white overflow-hidden">
        <div className="flex flex-wrap w-full items-center justify-between">
            <Link href="/"
                className="flex space-x-1 text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
            >
                <Image src={favicon} height={15} width={30} alt="Website Logo" />
                <span>Shopper</span>
            </Link>
            <div className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0">
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Search for products"
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-4xl"
                />
            </div>
            <div className="flex items-center space-x-4 sm:flex-none mt-4 sm:mt-0 flex-1">
                <Link href="/cart"

                    className="flex flex-1 relative justify-center sm:justify-start sm:flex-none itrems-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                    <TrolleyIcon className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{itemCount}</span>
                    <span>Cart</span>
                </Link>
                <ClerkLoaded>
                    <SignedIn>
                        <Link
                            href="/orders"
                            className="flex flex-1 relative justify-center sm:justify-start sm:flex-none itrems-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                        >

                            <PackageIcon className="w-6 h-6" />
                            <span>Orders</span>
                        </Link>
                    </SignedIn>
                    {
                        user ? (
                            <div className="flex items-center space-x-2">
                                <UserButton />

                                <div className="hidden sm:block text-xs">
                                    <p className="text-gray-400">Welcome back</p>
                                    <p className="font-bold">{user?.fullName}</p>
                                </div>
                            </div>
                        ) : (
                            <SignInButton
                                mode="modal"
                            />
                        )
                    }

                    {
                        user?.passkeys.length == 0 && (
                            <button
                                onClick={createPassKey}
                                className="bg-white hover:bg-blue-700 hover:text-white animate-pulse  font-bold text-blue-500 py-2 px-4 rounded border border-blue-300"
                            >
                                Create passkey
                            </button>
                        )
                    }

                </ClerkLoaded>
            </div>
        </div>
    </header>

}