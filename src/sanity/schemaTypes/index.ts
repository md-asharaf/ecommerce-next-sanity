import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { salesType } from "./saleType";
import { variantType } from "./variantType";
import { brandType } from "./brandType";

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [
        blockContentType,
        categoryType,
        productType,
        salesType,
        variantType,
        brandType
    ],
};
