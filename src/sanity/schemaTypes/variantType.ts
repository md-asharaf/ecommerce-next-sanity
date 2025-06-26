// schemas/variant.ts
import { defineField, defineType } from "sanity";

export const variantType = defineType({
    name: "variant",
    title: "Variant",
    type: "document",
    preview: {
        select: {
            title: 'title',
            // media: "images.0",
            product: "product.title",
            price: "price",
        },
        prepare({ title, product, price }) {
            return {
                title,
                subtitle: `${product} - $${price}`,
                // media
            };
        },
    },
    fields: [
        defineField({
            name: "product",
            title: "Product",
            type: "reference",
            to: [{ type: "product" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "title",
            title: "Variant Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "sku",
            title: "SKU",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "price",
            title: "Price",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "discountedPrice",
            title: "Discounted Price",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "stock",
            title: "Stock",
            type: "number",
            validation: (Rule) => Rule.required().min(0).integer(),
        }),
        defineField({
            name: "color",
            title: "Color",
            type: "string",
        }),
        defineField({
            name: "size",
            title: "Size",
            type: "string",
        }),
        defineField({
            name: "images",
            title: "Variant Images",
            type: "array",
            of: [{ type: "url" }],
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: "material",
            title: "Material",
            type: "string",
        }),
        defineField({
            name: "configuration",
            title: "Configuration",
            type: "string",
        }),
    ],
});
