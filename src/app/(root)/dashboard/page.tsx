
import { auth } from "@/auth";
import { ComponentWrapper } from "@/components/component-wrapper";
import { PageHeader } from "@/components/globals/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Users, Trophy, UploadCloud } from "lucide-react";
import { useSession } from "next-auth/react";

const recentProjects = [
  { id: 1, title: "AI Model for Climate Change", reward: "$50 Gift Card", deadline: "5d 12h" },
  { id: 2, title: "Medical Imaging Analysis", reward: "Recognition + $30", deadline: "3d 4h" },
  { id: 3, title: "Urban Traffic Flow Study", reward: "$20 Amazon Credit", deadline: "1d 8h" },
];

export default async function DashboardPage (){
  const session = await auth();
  const role = session!.user.role;

  console.log("role",role);

  return (
    <ComponentWrapper>
      <div className="container mx-auto">
        <PageHeader title="Dashboard" />

        {role === "RESEARCHER" && (
          <>
            {/* Researcher Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 p-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Datasets Uploaded</CardTitle>
                  <UploadCloud className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14</div>
                  <p className="text-xs text-muted-foreground">+2 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Research Projects</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">2 new opportunities</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,240</div>
                  <p className="text-xs text-muted-foreground">Growing community</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">+3 this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Requests */}
            <div className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Research Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.map((proj) => (
                      <div key={proj.id} className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{proj.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Deadline: {proj.deadline}
                          </p>
                        </div>
                        <div className="text-sm font-medium">{proj.reward}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {(role === "COLLABORATOR" || role === "PARTICIPANT") && (
          <>
            {/* Collaborator Contributions */}
            <div className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList>
                      <TabsTrigger value="active">Ongoing</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="rewards">Rewards</TabsTrigger>
                    </TabsList>

                    <TabsContent value="active">
                      <p className="text-sm text-muted-foreground">
                        You are currently contributing to 2 research projects.
                      </p>
                    </TabsContent>

                    <TabsContent value="completed">
                      <p className="text-sm text-muted-foreground">
                        You’ve successfully contributed to 12 studies.
                      </p>
                    </TabsContent>

                    <TabsContent value="rewards">
                      <p className="text-sm text-muted-foreground">
                        Total rewards earned: $180 and 3 certificates of recognition.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </ComponentWrapper>
  );
};