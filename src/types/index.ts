import { Address, Item, Order } from "@prisma/client";
import { Brand, Category, Product, Variant } from "../../sanity.types";
export interface SearchFilters {
    searchQuery: string;
    selectedCategories: string[];
    selectedBrands: string[];
    priceRange: [number, number];
    selectedRating: number | null;
    inStockOnly: boolean;
    featuredOnly: boolean;
}
export interface ExpandedProduct extends Omit<Product, "category" | "brand"> {
    category: Category;
    brand?: Brand;
    rating: {
        avg: number;
        count: number;
        reviewsCount: number;
    };
}
export interface ExpandedItem extends Item {
    product: ExpandedProduct;
    variant?: Variant;
}
export interface ExpandedOrder extends Omit<Order, "shippingAddress"> {
    items: ExpandedItem[];
    shippingAddress: Address;
}
export interface ExpandedCategory extends Category {
    isPopular?: boolean;
    isTrending?: boolean;
    productCount: number;
}
