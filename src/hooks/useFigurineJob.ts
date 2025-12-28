import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type FigurineStyle = "realistic" | "anime" | "lego" | "fortnite";
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface FigurineJob {
  id: string;
  original_image_url: string;
  style: FigurineStyle;
  status: JobStatus;
  model_url: string | null;
  preview_url: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export function useFigurineJob() {
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast({
          title: "Upload failed",
          description: uploadError.message,
          variant: "destructive",
        });
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const createJob = async (imageUrl: string, style: FigurineStyle): Promise<FigurineJob | null> => {
    setIsGenerating(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create a job",
          variant: "destructive",
        });
        return null;
      }

      // Create job in database with user_confirmed: true (direct generation)
      const { data: job, error: insertError } = await supabase
        .from("figurine_jobs")
        .insert({
          original_image_url: imageUrl,
          style: style,
          status: "pending",
          user_id: user.id,
          user_confirmed: true,
          validation_status: "approved",
        })
        .select()
        .single();

      if (insertError || !job) {
        console.error("Job creation error:", insertError);
        toast({
          title: "Failed to create job",
          description: insertError?.message || "Unknown error",
          variant: "destructive",
        });
        return null;
      }

      // Trigger the edge function
      const { error: invokeError } = await supabase.functions.invoke("generate-3d", {
        body: {
          jobId: job.id,
          imageUrl: imageUrl,
          style: style,
        },
      });

      if (invokeError) {
        console.error("Edge function error:", invokeError);
        toast({
          title: "Processing failed",
          description: invokeError.message,
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Processing started",
        description: "Your figurine is being generated...",
      });

      return job as FigurineJob;
    } catch (error) {
      console.error("Job creation error:", error);
      toast({
        title: "Failed to start generation",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getJob = async (jobId: string): Promise<FigurineJob | null> => {
    const { data, error } = await supabase
      .from("figurine_jobs")
      .select("*")
      .eq("id", jobId)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch job:", error);
      return null;
    }

    return data as FigurineJob | null;
  };

  const getAllJobs = async (): Promise<FigurineJob[]> => {
    const { data, error } = await supabase
      .from("figurine_jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch jobs:", error);
      return [];
    }

    return (data || []) as FigurineJob[];
  };

  return {
    uploadImage,
    createJob,
    getJob,
    getAllJobs,
    isUploading,
    isGenerating,
  };
}
