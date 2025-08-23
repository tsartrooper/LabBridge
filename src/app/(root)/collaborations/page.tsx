import prisma from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Users, Calendar, FileText, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/globals/page-header";
import Link from "next/link";
import { ComponentWrapper } from "@/components/component-wrapper";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function CollaborationsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

  const collaborations = await prisma.collaboration.findMany({
    where: {
      OR: [
        { researcherId: userId },
        { collaboratorId: userId }
      ]
    },
    include: {
      researchNeed: {
        select: {
          id: true,
          title: true,
          dataType: true,
          description: true
        }
      },
      researcher: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      collaborator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      messages: {
        select: {
          id: true
        }
      },
      files: {
        select: {
          id: true
        }
      },
      _count: {
        select: {
          messages: true,
          files: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
  }) as any;

  return (
    <ComponentWrapper>
      <div className="p-6 grid gap-6">
        <PageHeader title="My Collaborations" />

        {collaborations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No collaborations yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                { `You haven't started any collaborations yet. Browse research needs to get started.` }
              </p>
              <Link href="/research-needs">
                <Button>Browse Research Needs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collaborations.map((collab:any) => {
              const isResearcher = collab.researcherId === userId;
              const partner = isResearcher ? collab.collaborator : collab.researcher;
              const role = isResearcher ? "Researcher" : "Collaborator";

              return (
                <Card key={collab.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{collab.researchNeed.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {collab.researchNeed.dataType}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {collab.researchNeed.description}
                    </p>
                    
                    <div className="space-y-2">
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Partner:</span>
                        <span className="font-medium">{partner?.name || partner?.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {collab._count.messages} messages
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {collab._count.files} files
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Started {new Date(collab.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    <Link href={`/collaborations/${collab.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Open Workspace
                      </Button>
                    </Link>
                    <Link href={`/research-needs/${collab.researchNeedId}`}>
                      <Button variant="ghost" size="sm">
                        View Need
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ComponentWrapper>
  );
}