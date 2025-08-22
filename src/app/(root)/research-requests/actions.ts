"use server";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { authenticatedAction } from "@/lib/safe-action";
import { AuthenticationError } from "@/lib/utils";
import { statusUpdationSchema } from "@/schema/request-status-updation-schema";
import { revalidatePath } from "next/cache";

export const updateRequestStatus = authenticatedAction  
    .createServerAction()
    .input(statusUpdationSchema)
    .handler(async ({ input }) => {
        const session = await auth();

        if(!session?.user?.id){
            throw new AuthenticationError();
        }

        const collaborationRequest = await prisma.collaborationRequest.findUnique({
            where: {
                id: input.requestId,
                receiverId: input.receiverId
            },
            include: {
                researchNeed: true
            }
        });

        if (!collaborationRequest) {
            throw new Error("Collaboration request not found");
        }

        await prisma.$transaction(async (tx) => {
            await tx.collaborationRequest.update({
                where: {
                    id: input.requestId,
                    receiverId: input.receiverId
                },
                data: {
                    status: input.status
                }
            });

            if (input.status === "ACCEPTED") {
                await tx.collaboration.create({
                    data: {
                        researchNeedId: collaborationRequest.researchNeedId,
                        researcherId: collaborationRequest.receiverId,
                        collaboratorId: collaborationRequest.senderId,
                        requestId: collaborationRequest.id,
                        status: "IN_PROGRESS"
                    }
                });
            }
        });

        revalidatePath("/research-requests");
        revalidatePath("/collaborations");
    });