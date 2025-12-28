import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AnalysisResult {
  classification: "HEAD_MODEL" | "BUILDING_MODEL" | "ANIMAL_MODEL" | "FALLBACK_MODEL" | "REJECT_IMAGE";
  confidence: number;
  detected_object: string;
  quality_score: number;
  quality_issues: string[];
  needs_additional_images: boolean;
  additional_image_request: string | null;
  rejection_reason: string | null;
  can_proceed: boolean;
  recommendation: string;
}

export interface JobData {
  id: string;
  original_image_url: string;
  model_type: string | null;
  validation_status: string;
  detected_object: string | null;
  quality_report: AnalysisResult | null;
  rejection_reason: string | null;
  credits_consumed: boolean;
  user_confirmed: boolean;
}

export function useImageAnalysis() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobData, setJobData] = useState<JobData | null>(null);
  const { toast } = useToast();

  const uploadAndAnalyze = async (file: File, style: string) => {
    setIsUploading(true);
    setIsAnalyzing(false);
    setJobData(null);

    try {
      // Upload image to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error("Failed to upload image");
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to create a job");
      }

      // Create job in database
      const { data: job, error: jobError } = await supabase
        .from("figurine_jobs")
        .insert({
          original_image_url: imageUrl,
          style: style,
          status: "pending",
          validation_status: "pending",
          credits_consumed: false,
          user_id: user.id,
        })
        .select()
        .single();

      if (jobError || !job) {
        throw new Error("Failed to create job");
      }

      setIsUploading(false);
      setIsAnalyzing(true);

      // Call analyze-image edge function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        "analyze-image",
        {
          body: { jobId: job.id, imageUrl },
        }
      );

      if (analysisError) {
        throw new Error(analysisError.message || "Analysis failed");
      }

      // Fetch updated job data
      const { data: updatedJob, error: fetchError } = await supabase
        .from("figurine_jobs")
        .select("*")
        .eq("id", job.id)
        .single();

      if (fetchError || !updatedJob) {
        throw new Error("Failed to fetch job data");
      }

      setJobData(updatedJob as unknown as JobData);
      setIsAnalyzing(false);

      return { job: updatedJob, analysis: analysisData?.analysis };
    } catch (error) {
      console.error("Upload and analyze error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setIsUploading(false);
      setIsAnalyzing(false);
      throw error;
    }
  };

  const confirmFallback = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from("figurine_jobs")
        .update({
          user_confirmed: true,
          validation_status: "approved",
        })
        .eq("id", jobId);

      if (error) throw error;

      setJobData((prev) =>
        prev ? { ...prev, user_confirmed: true, validation_status: "approved" } : null
      );

      toast({
        title: "Confirmed",
        description: "You can now proceed with 3D generation.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addAdditionalImage = async (jobId: string, file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      // Get current job
      const { data: currentJob } = await supabase
        .from("figurine_jobs")
        .select("additional_images")
        .eq("id", jobId)
        .single();

      const currentImages = (currentJob?.additional_images as string[]) || [];

      // Update job with additional image
      const { error } = await supabase
        .from("figurine_jobs")
        .update({
          additional_images: [...currentImages, urlData.publicUrl],
          validation_status: "approved",
        })
        .eq("id", jobId);

      if (error) throw error;

      setJobData((prev) =>
        prev
          ? {
              ...prev,
              validation_status: "approved",
            }
          : null
      );

      toast({
        title: "Image Added",
        description: "Additional image uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload additional image.",
        variant: "destructive",
      });
    }
  };

  const startGeneration = async (jobId: string) => {
    try {
      // Get job data
      const { data: job } = await supabase
        .from("figurine_jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (!job) throw new Error("Job not found");

      // Update to processing and consume credits
      await supabase
        .from("figurine_jobs")
        .update({
          status: "processing",
          credits_consumed: true,
        })
        .eq("id", jobId);

      // Call generate-3d edge function
      const { data, error } = await supabase.functions.invoke("generate-3d", {
        body: {
          jobId,
          imageUrl: job.original_image_url,
          style: job.style,
          modelType: job.model_type,
        },
      });

      if (error) throw error;

      toast({
        title: "Generation Started",
        description: "Your 3D model is being generated. This may take a few minutes.",
      });

      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start generation. Credits not consumed.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetAnalysis = () => {
    setJobData(null);
    setIsUploading(false);
    setIsAnalyzing(false);
  };

  return {
    isUploading,
    isAnalyzing,
    jobData,
    uploadAndAnalyze,
    confirmFallback,
    addAdditionalImage,
    startGeneration,
    resetAnalysis,
  };
}
