import { z } from "zod";


export const collaborationRequestSchema = z.object({
    message: z.string().optional(),
    receiverId: z.string().optional(),
    researchNeedId: z.string().optional()
});