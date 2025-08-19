"use server";

import prisma from "@/lib/db";
import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";

// Only allow these roles
// const roleSchema = z.enum(["RESEARCHER", "COLLABORATOR"]);

export const chooseRole = authenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ input, ctx }) => {
    if (!ctx.user?.id) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {id: ctx.user.id}
    });

    if(user?.role != null) return user;

    const updatedUser = await prisma.user.update({
      where: { id: ctx.user.id },
      data: { role: input },
    });

    console.log("role set: ",updatedUser.role);

    return;
  });


