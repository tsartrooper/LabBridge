"use server"

import { auth } from "@/auth";
import { authenticatedAction } from "@/lib/safe-action";
import { AuthenticationError } from "@/lib/utils";
import { collaborationRequestSchema } from "@/schema/collaboration-request-schema";
import { revalidatePath } from "next/cache";


export const createCollaborationRequestAction = authenticatedAction
                .createServerAction()
                .input(collaborationRequestSchema)
                .handler(async ({ input }) => {
                    const session = await auth();
                    
                    if (!session?.user?.id) {
                        throw new AuthenticationError();
                    }

                    // await prisma
                    revalidatePath("/research-needs");
                });