"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useServerAction } from "zsa-react";
import { uploadFile } from "../actions";

interface FileUploadFormProps {
  collaborationId: string;
}

export default function FileUploadForm({ collaborationId }: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const { execute, isPending } = useServerAction(uploadFile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("description", description);
        formData.append("collaborationId", collaborationId);

        console.log("uploading the file/");

        console.log("file name: ",file.name);
        console.log("file type: ",file.type);

        await execute({
            collaborationId,
            description: description.trim() || file.name,
            formData: formData,
        });

        setFile(null);
        setDescription("");
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        } catch (error) {
            console.error("Error uploading file:", error);
        }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="file-upload">Choose File</Label>
        <Input
          id="file-upload"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1"
        />
      </div>
      
      {file && (
        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            placeholder="Describe this file..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
          />
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={isPending || !file}
        size="sm"
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isPending ? "Uploading..." : "Upload File"}
      </Button>
    </form>
  );
}