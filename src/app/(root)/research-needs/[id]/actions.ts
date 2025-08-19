"use server"

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { authenticatedAction } from "@/lib/safe-action";
import { AuthenticationError } from "@/lib/utils";
import { collaborationRequestSchema } from "@/schema/collaboration-request-schema";
import { revalidatePath } from "next/cache";
import { any } from "zod";


export const createCollaborationRequestAction = authenticatedAction
                .createServerAction()
                .input(collaborationRequestSchema)
                .handler(async ({ input }) => {
                    const session = await auth();
                    
                    if (!session?.user?.id) {
                        throw new AuthenticationError();
                    }

                    await prisma.collaborationRequest.create({
                        data:{
                            title: input.title,
                            message: input.message??"",
                            researchNeedId: input.researchNeedId,
                            senderId: session.user.id,
                            receiverId: input.receiverId,
                            contributionType: input.contributionType
                        }
                    });

                    // await prisma
                    revalidatePath("/research-needs");
                });