import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, Database, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageHeader } from "@/components/globals/page-header";
import { CreateCollaborationRequestModal } from "./_components/create-request";
import { ComponentWrapper } from "@/components/component-wrapper";
import { getCurrentUser } from "@/lib/session"; // adjust according to your auth setup

type Props = {
    params: {
        id: string;
    };
};

export default async function ResearchNeedDetailPage({ params }: Props) {
    const need = await prisma.researchNeed.findUnique({
        where: { id: params.id },
    });

    if (!need) {
        notFound();
    }

    const user = await getCurrentUser();

    let existingRequest = null;
    if (user) {
        existingRequest = await prisma.collaborationRequest.findFirst({
            where: {
                senderId: user.id,
                researchNeedId: need.id,
            },
        });
    }

    return (
        <ComponentWrapper>
            <div className="p-6 max-w-3xl mx-auto">
                <PageHeader title={need.title} />
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <CardTitle>{need.title}</CardTitle>
                        </div>
                        <CardDescription>{need.dataType}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-base">{need.description}</p>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Database className="h-4 w-4" />
                            Required Format: {need.requiredFormat}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Posted on {new Date(need.createdAt).toLocaleDateString()}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href="/research-needs">
                            <Button variant="outline">Back to List</Button>
                        </Link>

                        {existingRequest ? (
                            <Link href="/research-requests">
                                <Button>View Your Request</Button>
                            </Link>
                        ) : (
                            <CreateCollaborationRequestModal 
                                receiverId={need.ownerId}
                                researchNeedId={need.id} 
                            />
                        )}
                    </CardFooter>
                </Card>
            </div>
        </ComponentWrapper>
    );
}
