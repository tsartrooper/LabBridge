import prisma from "@/lib/db";
import { auth } from "@/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/globals/page-header";
import { ComponentWrapper } from "@/components/component-wrapper";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default async function ResearchRequestsPage() {
  const session = await auth();

  console.log("role:",session?.user.role);

  if (!session?.user?.id) {
    return (
      <ComponentWrapper>
        <div className="p-6">
          <PageHeader title="Research Requests" />
          <p className="text-muted-foreground mt-4">
            You need to be logged in to view your requests.
          </p>
        </div>
      </ComponentWrapper>
    );
  }

  const requestsSent = await prisma.collaborationRequest.findMany({
    where: {
      senderId: session.user.id,
    },
    include: {
      receiver: true,
      researchNeed: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = requestsSent.filter((r) => r.status === "PENDING");
  const accepted = requestsSent.filter((r) => r.status === "ACCEPTED");
  const rejected = requestsSent.filter((r) => r.status === "REJECTED");

  const renderRequests = (list: typeof requestsSent) => {
    if (list.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          No requests in this category.
        </p>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((req) => (
          <Card key={req.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>
                  {req.researchNeed?.title ?? "Research Request"}
                </CardTitle>
              </div>
              <CardDescription>
                Sent to: {req.receiver?.name ?? "Unknown"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {req.message || "No message provided."}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/research-needs/${req.researchNeedId}`}>
                <Button variant="outline" size="sm">
                  View Research Need
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <ComponentWrapper>
      <div className="p-6 grid gap-6">
        <PageHeader title="Research Requests" />

        {requestsSent.length === 0 ? (
          <p className="text-muted-foreground">
            You haven’t sent any collaboration requests yet.
          </p>
        ) : (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">{renderRequests(pending)}</TabsContent>
            <TabsContent value="accepted">{renderRequests(accepted)}</TabsContent>
            <TabsContent value="rejected">{renderRequests(rejected)}</TabsContent>
          </Tabs>
        )}
      </div>
    </ComponentWrapper>
  );
}
