"use server";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { PageHeader } from "@/components/globals/page-header";
import { ComponentWrapper } from "@/components/component-wrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RequestCard from "./_components/research-request-card";

export default async function ResearchRequestsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-6">
        <p>You need to be logged in to view your requests.</p>
      </div>
    );
  }

  const userRole = session.user.role || "INDUSTRY";
  const userId = session.user.id;

  let requests;
  if (userRole === "RESEARCHER") {
    requests = await prisma.collaborationRequest.findMany({
      where: { receiverId: userId },
      include: { 
        sender: { select: { id: true, name: true } }, 
        researchNeed: { select: { id: true, title: true } }, 
        receiver: { select: { id: true, name: true } } 
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    requests = await prisma.collaborationRequest.findMany({
      where: { senderId: userId },
      include: { 
        receiver: { select: { id: true, name: true } }, 
        researchNeed: { select: { id: true, title: true } }, 
        sender: { select: { id: true, name: true } } 
      },
      orderBy: { createdAt: "desc" },
    });
  }

  const safeRequests = requests || [];

  const pending = safeRequests.filter((r:any) => r.status === "PENDING");
  const accepted = safeRequests.filter((r:any) => r.status === "ACCEPTED");
  const rejected = safeRequests.filter((r:any) => r.status === "REJECTED");

  const renderRequests = (list: typeof safeRequests) => {
    if (list.length === 0) {
      return <p className="p-4 text-gray-500">No requests in this category.</p>;
    }
    return (
      <div className="space-y-4">
        {list.map((req:any) => (
          <RequestCard 
            key={req.id} 
            req={req} 
            userRole={userRole} 
            userId={userId} 
          />
        ))}
      </div>
    );
  };

  return (
    <ComponentWrapper>
      <PageHeader title="Collaboration Requests" />
      {safeRequests.length === 0 ? (
        <p className="p-6 text-gray-500">
          { `You haven't ${userRole === "RESEARCHER" ? "received" : "sent"} any collaboration requests yet.` }
        </p>
      ) : (
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({accepted.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">{renderRequests(pending)}</TabsContent>
          <TabsContent value="accepted">{renderRequests(accepted)}</TabsContent>
          <TabsContent value="rejected">{renderRequests(rejected)}</TabsContent>
        </Tabs>
      )}
    </ComponentWrapper>
  );
}