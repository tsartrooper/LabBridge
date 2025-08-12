import * as z from "zod";

export const researchNeedSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Please add more detail"),
    dataType: z.string().min(1, "Select a data type"),
    requiredFormat: z.string().min(10, "format must be provided.")
});