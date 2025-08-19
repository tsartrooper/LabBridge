"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Plus } from "lucide-react";
import { createCollaborationRequestAction } from "../actions";
import { collaborationRequestSchema } from "@/schema/collaboration-request-schema";


type CreateCollaborationRequestModalProps = {
    receiverId: string;
    researchNeedId: string;
};

export const CreateCollaborationRequestModal = ({
  receiverId,
  researchNeedId,
}: CreateCollaborationRequestModalProps) => {
    const form = useForm<z.infer<typeof collaborationRequestSchema>>({
        resolver: zodResolver(collaborationRequestSchema),
        defaultValues: {
        title: "",
        message: "",
        contributionType: "",
        receiverId,
        researchNeedId,
        },
    });

    const { execute, isPending } = useServerAction(
        createCollaborationRequestAction,
        {
        onError({ err }) {
            console.error(err);
            toast.error("Failed to send collaboration request");
        },
        onSuccess() {
            toast.success("Collaboration request sent");
            form.reset();
        },
        }
    );

    function onSubmit(values: z.infer<typeof collaborationRequestSchema>) {
        execute({
        ...values,
        });
    }

    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Send Request
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
            <DialogTitle>Send Collaboration Request</DialogTitle>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="Eg. Data analysis support for cancer study" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="contributionType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contribution Type</FormLabel>
                    <FormControl>
                        <Input placeholder="Eg. Funding, dataset, technical expertise" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Add a short note about why you want to collaborate..."
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                    <>
                    Sending...
                    <Loader2 className="ml-2 animate-spin h-4 w-4" />
                    </>
                ) : (
                    "Send Request"
                )}
                </Button>
            </form>
            </Form>
        </DialogContent>
        </Dialog>
    );
};
