import { z } from "zod";

export const clickSchema = z.object({
    clicks: z.array(z.object({
        id: z.string(),
        x: z.number(),
        y: z.number(),
    })),
    userId: z.string({ message: "Invalid userId"}),
})