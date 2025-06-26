// /schemas/product.js
import { defineType, defineField } from "sanity";

export const productType = defineType({
    name: "product",
    title: "Product",
    type: "document",
    preview: {
        select: {
            title: "title",
            category: "category.title",
            price: "originalPrice",
        },
        prepare({ title, category, price }) {
            return {
                title,
                subtitle: `${category} - $${price}`,
                // media,
            };
        },
    },
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title" },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "images",
            title: "Images",
            type: "array",
            of: [{ type: "url" }],
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: "videos",
            title: "Videos",
            type: "array",
            of: [{ type: "url" }],
        }),
        defineField({
            name: "isFeatured",
            title: "Is Featured?",
            type: "boolean",
            initialValue: false,
        }),
        // Common
        defineField({
            name: "category",
            title: "Category",
            type: "reference",
            to: [{ type: "category" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "brand",
            title: "Brand",
            type: "reference",
            to: [{ type: "brand" }],
        }),
        defineField({
            name: "originalPrice",
            title: "Original Price",
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
            initialValue: 0,
        }),
        defineField({
            name: "highlights",
            title: "Highlights",
            type: "array",
            of: [{ type: "string" }],
        }),

        // Flexible specs for automation
        defineField({
            name: "specifications",
            title: "Specifications",
            type: "array",
            of: [
                defineField({
                    name: "spec",
                    type: "object",
                    fields: [
                        {
                            name: "label",
                            type: "string",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "value",
                            type: "string",
                            validation: (Rule) => Rule.required(),
                        },
                    ],
                }),
            ],
        }),

        defineField({ name: "material", title: "Material", type: "string" }),
        defineField({
            name: "careInstructions",
            title: "Care Instructions",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "dosAndDonts",
            title: "Dos and Don'ts",
            type: "array",
            of: [
                defineField({
                    name: "rule",
                    type: "object",
                    fields: [
                        {
                            name: "type",
                            type: "string",
                            options: { list: ["Do", "Don't"] },
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "text",
                            type: "string",
                            validation: (Rule) => Rule.required(),
                        },
                    ],
                }),
            ],
        }),

        defineField({
            name: "features",
            title: "Features",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "includedItems",
            title: "Included Items",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "usage",
            title: "Usage Instructions",
            type: "array",
            of: [{ type: "string" }],
        }),

        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
        }),

        // For variants (clothes, shoes, etc.)
        defineField({
            name: "hasVariants",
            title: "Has Variants",
            type: "boolean",
            validation: (Rule) => Rule.required(),
        }),
    ],
});
