import prisma from "@/lib/db";


export async function createResearchNeed(
    ownerId: string,
    title: string,
    description: string,
    requiredFormat: string,
    exampleSchema?: object,
    rewardInfo?: object
){
    const researchNeed =  await prisma.researchNeed.create({
        data:{
            ownerId,
            title,
            description,
            requiredFormat,
            exampleSchema:"",
            rewardInfo:""
        }
    })
}