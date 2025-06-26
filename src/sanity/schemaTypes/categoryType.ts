import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
    name: "category",
    title: "Categories",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "url",
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "description",
            // media: "image",
        },
        prepare({ title, subtitle }) {
            return {
                title,
                subtitle: subtitle
                    ? subtitle.slice(0, 50) + "..."
                    : "No description",
                // media,
            };
        },
    },
});
