import prisma from "@/lib/db";
import ResearchNeedForm from "@/app/(root)/research-needs/_components/research-need-form";

export default async function ResearchNeedsPage() {

  return (
    <div className="p-4 grid gap-6">

      <div className="border p-4 rounded-lg bg-white shadow">
        <h1 className="text-2xl font-bold mb-4">Submit a Research Need</h1>
        <ResearchNeedForm />
      </div>
    </div>
  );
}
