"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { researchNeedSchema } from "@/schema/research-need-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { createResearchNeedAction } from "@/app/(root)/research-needs/actions";

type FormValues = z.infer<typeof researchNeedSchema>;

export default function ResearchNeedForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(researchNeedSchema),
    defaultValues: {
      title: "",
      description: "",
      dataType: "",
      requiredFormat: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createResearchNeedAction(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Research Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Climate Change Impact Survey"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Give a short but clear title for your research need.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the research goal, required data, and context..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data Type */}
        <FormField
          control={form.control}
          name="dataType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Type Needed</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of data" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="survey">Survey Data</SelectItem>
                  <SelectItem value="medical">Medical Data</SelectItem>
                  <SelectItem value="environmental">Environmental Data</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Required Format */}
        <FormField
          control={form.control}
          name="requiredFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Format</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. CSV, JSON, PDF with structured data..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Specify the exact format you need the data in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Submit Research Need
        </Button>
      </form>
    </Form>
  );
}
