"use client";

import { useServerAction } from "zsa-react";
import { chooseRole } from "./actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/layout";
import { Button } from "@/components/ui/button";
import { Loader2, Home, Users, Search } from "lucide-react";
import Link from "next/link";

export default function ChooseRole() {
    const { data: session, update } = useSession();
    const router = useRouter();

    const { execute, isPending } = useServerAction(chooseRole, {
        onSuccess() {
            router.push("/dashboard");
        },
    });

    const handleChoose = async (role: string) => {
        if (session?.user.role != null) return;

        console.log("changed role: ", role);
        await execute(role);

        const result = await update({
            ...session,
            user: {
                ...session?.user,
                role: role,
            },
        });

        if (!isPending) {
            if (result) {
                toast.success(`Role's been set, refresh the page`);
                window.location.href = "/dashboard";
            } else {
                toast.error(`Failed to update the session ${result}`);
            }

            router.refresh();
            router.replace("/dashboard");
        }
    };

    return (
        <AuthLayout type="Sign-Up" text="Select your role to continue">
            <div className="w-full space-y-4">
                <Button
                    onClick={() => {
                        if (!isPending) handleChoose("RESEARCHER");
                    }}
                    disabled={isPending}
                    className="w-full py-[6px] bg-black text-white hover:bg-gray-900 disabled:opacity-60"
                >
                    <Search className="w-4 h-4 mr-2" />
                    Researcher
                    {isPending && (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    )}
                </Button>

                <Button
                    onClick={() => {
                        if (!isPending) handleChoose("COLLABORATOR");
                    }}
                    disabled={isPending}
                    className="w-full py-[6px] bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-60"
                >
                    <Users className="w-4 h-4 mr-2" />
                    Collaborator
                    {isPending && (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    )}
                </Button>

                <div className="pt-4 border-t border-gray-200">
                    <Link href="/" className="w-full">
                        <Button
                            variant="outline"
                            className="w-full py-[6px] border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
