"use server";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { authenticatedAction } from "@/lib/safe-action";
import { supabase } from "@/lib/supaBaseClient";
import { AuthenticationError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";


const sendMessageSchema = z.object({
    collaborationId: z.string(),
    content: z.string().min(1, "Message content is required").max(1000, "Message too long")
});


const updateStatusSchema = z.object({
    collaborationId: z.string(),
    status: z.enum(["IN_PROGRESS", "PAUSED", "COMPLETED", "CANCELLED"])
});


const uploadFileSchema = z.object({
    collaborationId: z.string(),
    description: z.string().optional(),
    formData: z.instanceof(FormData, {message: "expected a file"}),
});

export const sendMessage = authenticatedAction
    .createServerAction()
    .input(sendMessageSchema)
    .handler(async ({ input }) => {
        const session = await auth();

        if (!session?.user?.id) {
        throw new AuthenticationError();
        }

        const collaboration = await prisma.collaboration.findFirst({
        where: {
            id: input.collaborationId,
            OR: [
            { researcherId: session.user.id },
            { collaboratorId: session.user.id }
            ]
        }
        });

        if (!collaboration) {
        throw new Error("Collaboration not found or access denied");
        }

        await prisma.workspaceMessage.create({
        data: {
            collaborationId: input.collaborationId,
            senderId: session.user.id,
            content: input.content
        }
    });

        revalidatePath(`/collaborations/${input.collaborationId}`);
    });

export const updateCollaborationStatus = authenticatedAction
    .createServerAction()
    .input(updateStatusSchema)
    .handler(async ({ input }) => {
        const session = await auth();

        if (!session?.user?.id) {
        throw new AuthenticationError();
        }

    const collaboration = await prisma.collaboration.findFirst({
        where: {
            id: input.collaborationId,
            researcherId: session.user.id 
        }
    });

        if (!collaboration) {
        throw new Error("Collaboration not found or you don't have permission to update status");
        }

    await prisma.collaboration.update({
        where: {
            id: input.collaborationId
        },
        data: {
            status: input.status,
            updatedAt: new Date()
        }
    });

        revalidatePath(`/collaborations/${input.collaborationId}`);
        revalidatePath("/collaborations");
  });

export const uploadFile = authenticatedAction
    .createServerAction()
    .input(uploadFileSchema)
    .handler(async ({ input }) => {
    const session = await auth();

    if (!session?.user?.id) {
        throw new AuthenticationError();
    }   

    const file = input.formData.get("file") as File;

    const filePath = `collaborationFiles/${input.collaborationId}/${Date.now()}-${file.name}`



    const collaboration = await prisma.collaboration.findFirst({
        where: {
            id: input.collaborationId,
            OR: [
            { researcherId: session.user.id },
            { collaboratorId: session.user.id }
            ]
        }
    });

    if (!collaboration) {
        throw new Error("Collaboration not found or access denied");
    }

    const bucketName = process.env.SUPABASE_BUCKET_NAME as string;

    const { error } = await supabase
                                .storage
                                .from(bucketName as string)
                                .upload(filePath, file);

    if(error) throw error;

    const { data: fileUrl } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    await prisma.workspaceFile.create({
        data: {
            collaborationId: input.collaborationId,
            senderId: session.user.id,
            fileUrl: fileUrl.publicUrl,
            description: input.description || "Uploaded file",
            title: file.name
        }
    });

    revalidatePath(`/collaborations/${input.collaborationId}`);
    });