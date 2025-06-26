import { defineType } from "sanity";

export const brandType = defineType({
    name: "brand",
    title: "Brand",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: "logo",
            title: "Logo",
            type: "url",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "text",
            validation: (Rule) => Rule.required(),
        },
    ],
    preview: {
        select: {
            title: "name",
            // media: "logo",
        },
        prepare({ title }) {
            return {
                title,
                // media,
            };
        }
    },
});
