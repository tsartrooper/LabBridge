"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { updateRequestStatus } from "../actions";


type ResearchRequest = {
    id: string;
    researchNeedId: string;
    receiverId: string;
    status: string;
    message?: string | null;
    createdAt: Date;
    researchNeed?: {
        id: string;
        title: string;
    } | null;
    sender?: {
        id: string;
        name: string | null;
    } | null;
    receiver?: {
        id: string;
        name: string | null;
    } | null;
};

interface RequestCardProps {
    req: ResearchRequest;
    userRole: string;
    userId: string;
}

export default function RequestCard({ req, userRole, userId }: RequestCardProps) {

    const { execute, isPending } = useServerAction(updateRequestStatus);
    if (!req) {
        return (
        <Card>
            <CardContent className="p-4">
            <p className="text-gray-500">Invalid request data</p>
            </CardContent>
        </Card>
        );
    }

    const handleStatusUpdate = async (status: "ACCEPTED" | "REJECTED") => {
        try {
        await execute({
            requestId: req.id,
            receiverId: userId,
            status,
        });
        } catch (err) {
        console.error("Error updating the status: ", err);
        }
    };

    const researchTitle = req.researchNeed?.title || "Research Request";
    const senderName = req.sender?.name || "Unknown Sender";
    const receiverName = req.receiver?.name || "Unknown Receiver";
    const requestMessage = req.message || "No message provided.";
    
    const getStatusColor = (status: string) => {
        switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800";
        case "ACCEPTED":
            return "bg-green-100 text-green-800";
        case "REJECTED":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-lg">{researchTitle}</CardTitle>
                    <CardDescription>
                    {userRole === "RESEARCHER"
                        ? `Received from: ${senderName}`
                        : `Sent to: ${receiverName}`}
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        
        <CardContent>
            <p className="text-sm text-gray-600">{requestMessage}</p>
            {req.createdAt && (
                <p className="text-xs text-gray-400 mt-2">
                    Sent: {new Date(req.createdAt).toLocaleDateString()}
                </p>
            )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center">
            <Link href={`/research-needs/${req.researchNeedId}`}>
            <Button variant="outline" size="sm">
                View Research Need
            </Button>
            </Link>

            {userRole === "RESEARCHER" && req.status === "PENDING" && (
            <div className="space-x-2">
                <Button
                onClick={() => handleStatusUpdate("ACCEPTED")}
                disabled={isPending}
                size="sm"
                >
                {isPending ? "Processing..." : "Accept"}
                </Button>
                <Button
                onClick={() => handleStatusUpdate("REJECTED")}
                variant="destructive"
                disabled={isPending}
                size="sm"
                >
                {isPending ? "Processing..." : "Reject"}
                </Button>
            </div>
            )}
        </CardFooter>
        </Card>
    );
}