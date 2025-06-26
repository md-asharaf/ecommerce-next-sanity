import { z } from "zod";
export const searchParamsSchema = z.object({
    page: z.preprocess(
        (val) => Number(val),
        z.number().int().positive().default(1)
    ),
    limit: z.preprocess(
        (val) => Number(val),
        z.number().int().positive().default(10)
    ),
});