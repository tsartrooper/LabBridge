import prisma from "@/lib/db";
import ResearchNeedForm from "@/app/(root)/research-needs/_components/research-need-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/globals/page-header";
import Link from "next/link";
import { ComponentWrapper } from "@/components/component-wrapper";

export default async function ResearchNeedsPage() {
  
  const needs = await prisma.researchNeed.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <ComponentWrapper>
      <div className="p-6 grid gap-6">
        <PageHeader title="Research Needs" />

        <Card>
          <CardHeader>
            <CardTitle>Submit a Research Need</CardTitle>
            <CardDescription>
              Fill out the form to post a new research need to the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResearchNeedForm />
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((need:any) => (
            <Card key={need.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>{need.title}</CardTitle>
                </div>
                <CardDescription>{need.dataType}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {need.description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Database className="h-4 w-4" />
                  Required Format: {need.requiredFormat}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/research-needs/${need.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </ComponentWrapper>
  );
}
