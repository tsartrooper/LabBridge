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
    researchNeedId: string
};

export const CreateCollaborationRequestModal = ({
    receiverId,
    researchNeedId
}: CreateCollaborationRequestModalProps) => {
    const form = useForm<z.infer<typeof collaborationRequestSchema>>({
        resolver: zodResolver(collaborationRequestSchema),
        defaultValues: {
            message: "",
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
            receiverId,
            researchNeedId,
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Send Request
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send Collaboration Request</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add a short note to the receiver"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending} className="w-full">
                            Send Request
                            {isPending && <Loader2 className="ml-2 animate-spin size-4" />}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
