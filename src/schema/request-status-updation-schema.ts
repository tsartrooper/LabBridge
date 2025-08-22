import z from "zod";



export const statusUpdationSchema = z.object({
    requestId:  z.string(),
    receiverId: z.string(),
    status:     z.string()
})