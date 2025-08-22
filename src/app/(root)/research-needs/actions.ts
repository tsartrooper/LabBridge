"use server";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { authenticatedAction } from "@/lib/safe-action";
import { AuthenticationError } from "@/lib/utils";
import { researchNeedSchema } from "@/schema/research-need-schema";
import { revalidatePath } from "next/cache";

export const createResearchNeedAction = authenticatedAction
  .createServerAction()
  .input(researchNeedSchema)
  .handler(async ({ input }) => {
    const session = await auth();

    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    await prisma.researchNeed.create({
      data: {
        ownerId: session.user.id,
        title: input.title,
        description: input.description,
        dataType: input.dataType,
        requiredFormat: input.requiredFormat
      },
    });

    revalidatePath("/research-needs");
  });
