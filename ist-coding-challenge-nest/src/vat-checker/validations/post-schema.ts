import { z } from "zod";


export const PostSchemaVatValidator = z.object({
    body: z.object({
        countryCode: z.string().length(2, { message: 'contryCode must be 2 characters length' }),
        vat: z.string().min(8).max(12, { message: 'vat must be between 8 to 12 length' })
    })
});