"use client"
import { useAuth } from '@clerk/nextjs'
import { Product, Variant } from '../../sanity.types'
import { useCartStore } from '@/store/cart'
import { axiosInstance } from '@/lib/axios'
import { useState } from 'react'
import { Loader2, Minus, Plus } from 'lucide-react'
import { Button } from './ui/button'

interface QuantitySelectorProps {
    item: {
        product: Product,
        variant?: Variant,
        id?: string,
    },
    disabled?: boolean
}

const QuantitySelector = ({ item: { product, variant, id }, disabled = false }: QuantitySelectorProps) => {
    const { userId } = useAuth()
    const { addItem, getItemCount, removeItem } = useCartStore()
    const itemCount = getItemCount(product._id, variant?._id)
    const [loading, setLoading] = useState(false)
    const handleAddItem = async () => {
        if (disabled) return;
        setLoading(true);
        try {
            if (userId) {
                await axiosInstance.post('/cart/item', {
                    productId: product._id,
                    variantId: variant?._id,
                    quantity: 1,
                    unitPrice: variant?.discountedPrice || product.discountedPrice || product.originalPrice || 0,
                    originalPrice: variant?.price || product.originalPrice || 0
                });
            }
            addItem(product, variant, 1, id);
        } catch (error) {
            console.error("Error adding item to cart:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleRemoveItem = async () => {
        setLoading(true);
        try {
            if (userId) {
                if (itemCount === 1) {
                    await axiosInstance.delete(`/cart/item/${id}`);
                } else {
                    await axiosInstance.patch(`/cart/item/${id}`, {
                        productId: product._id,
                        variantId: variant?._id,
                        quantity: itemCount - 1,
                    });
                }
            }
            removeItem(product._id, variant?._id);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex items-center border rounded-lg">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveItem}
                disabled={disabled}
                className="h-8 w-8 p-0"
            >
                <Minus className="h-3 w-3" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                {loading? <Loader2 className="h-4 w-4 animate-spin" /> : itemCount}
            </span>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleAddItem}
                disabled={disabled}
                className="h-8 w-8 p-0"
            >
                <Plus className="h-3 w-3" />
            </Button>
        </div>
        // <div className='flex items-center justify-center'>
        //     <table className='border-collapse border border-gray-300 rounded-md'>
        //         <tbody>
        //             <tr>
        //                 <td className='border-x border-gray-300 hover:bg-gray-200'>
        //                     <button
        //                         className={`w-8 h-8 rounded flex items-center justify-center transition-colors duration-200`}
        //                         onClick={handleRemoveItem}
        //                     >
        //                         <span className='text-3xl'>-</span>
        //                     </button>
        //                 </td>
        //                 <td className='border-x border-gray-300 px-2'>
        //                     <span className='w-8 h-8 text-center font-semibold'>
        //                         {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : itemCount}
        //                     </span>
        //                 </td>
        //                 <td className='border-x border-gray-300 hover:bg-gray-200'>
        //                     <button
        //                         className={`w-8 h-8 rounded flex items-center justify-center transition-colors duration-200 ${disabled && "bg-gray-400 cursor-not-allowed"}`}
        //                         disabled={disabled}
        //                         onClick={handleAddItem}
        //                     >
        //                         <span className='text-xl'>+</span>
        //                     </button>
        //                 </td>
        //             </tr>
        //         </tbody>
        //     </table>
        // </div>
    )
}

export default QuantitySelector