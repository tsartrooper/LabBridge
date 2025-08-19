import { z } from "zod";


export const collaborationRequestSchema = z.object({
    message: z.string().optional(),
    title: z.string().min(3, "Title is required"),
    contributionType: z.string().optional(),
    receiverId: z.string(),
    researchNeedId: z.string(),
});