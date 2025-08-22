import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Upload,
  Download,
  Settings,
  ArrowLeft,
  Database,
} from "lucide-react";
import Link from "next/link";

import { ComponentWrapper } from "@/components/component-wrapper";
import MessageForm from "./_components/message-form";
import FileUploadForm from "./_components/file-upload-form";
import { PageHeader } from "@/components/globals/page-header";


interface WorkspacePageProps {
  params: {
    id: string;
  };
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

const collaboration = await prisma.collaboration.findUnique({
    where: {
      id: params.id,
      OR: [
        { researcherId: userId },
        { collaboratorId: userId }
      ]
    },
    include: {
      researchNeed: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
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
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      files: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!collaboration) {
    notFound();
  }

  const isResearcher = collaboration.researcherId === userId;
  const userRole = isResearcher ? "Researcher" : "Collaborator";

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <ComponentWrapper>
      <div className="p-6 max-w-7xl mx-auto">
        < PageHeader title={collaboration.researchNeed.title} >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{}</h1>
              <p className="text-muted-foreground mt-1">
                Collaboration Workspace • Your role: {userRole}
              </p>
          </div>
        
        </PageHeader>

        <div className="flex items-center gap-4 mb-4">
            <Link href="/collaborations">
            <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Collaborations
            </Button>
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages
                  </CardTitle>
                  <CardDescription>
                    {collaboration.messages.length} messages in this workspace
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                  {collaboration.messages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No messages yet. Start the conversation!
                    </p>
                  ) : (
                    collaboration.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === userId ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === userId
                              ? "bg-primary text-primary-foreground ml-4"
                              : "bg-muted mr-4"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Separator className="mb-4" />
                <MessageForm collaborationId={collaboration.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Shared Files
                </CardTitle>
                <CardDescription>
                  {collaboration.files.length} files shared in this workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {collaboration.files.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No files shared yet.
                    </p>
                  ) : (
                    collaboration.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              {file.description || "Shared file"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Shared by {file.sender.name || file.sender.email} • {" "}
                              {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" >
                          <a href={file.fileUrl}  download={file.title}><Download className="h-4 w-4" /> </a>
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                <Separator className="mb-4" />
                <FileUploadForm collaborationId={collaboration.id} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaboration Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Research Need</p>
                  <p className="text-sm text-muted-foreground">
                    {collaboration.researchNeed.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Database className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {collaboration.researchNeed.dataType}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-3">Participants</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(collaboration.researcher.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {collaboration.researcher.name || collaboration.researcher.email}
                        </p>
                        <p className="text-xs text-muted-foreground">Researcher</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(collaboration.collaborator.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {collaboration.collaborator.name || collaboration.collaborator.email}
                        </p>
                        <p className="text-xs text-muted-foreground">Collaborator</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Started {new Date(collaboration.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Workspace Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <Separator />
                
                <div className="space-y-2">
                  <Link href={`/research-needs/${collaboration.researchNeedId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Research Need
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ComponentWrapper>
  );
}