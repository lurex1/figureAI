import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Pipeline selection based on model type
const PIPELINE_INFO: Record<string, { name: string; description: string }> = {
  HEAD_MODEL: { name: "Face NeRF / Photogrammetry", description: "Specialized for human head reconstruction" },
  BUILDING_MODEL: { name: "Depth + Photogrammetry", description: "Optimized for architectural structures" },
  ANIMAL_MODEL: { name: "Mesh Reconstruction + Pose Normalization", description: "Full-body animal modeling" },
  FALLBACK_MODEL: { name: "Object-centric Photogrammetry + Mesh Cleanup", description: "General object reconstruction" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, imageUrl, style, modelType } = await req.json();

    console.log(`[generate-3d] Starting job ${jobId}`);
    console.log(`[generate-3d] Model type: ${modelType}, Style: ${style}`);
    console.log(`[generate-3d] Image URL: ${imageUrl}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify job exists and is approved
    const { data: job, error: jobError } = await supabase
      .from("figurine_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      console.error("[generate-3d] Job not found:", jobError);
      throw new Error("Job not found");
    }

    // Verify the job is approved (credits should only be consumed for approved jobs)
    if (job.validation_status !== "approved" && !job.user_confirmed) {
      console.error("[generate-3d] Job not approved for generation");
      throw new Error("Job must be approved before generation");
    }

    // Update job status to processing and consume credits
    const { error: updateError } = await supabase
      .from("figurine_jobs")
      .update({ 
        status: "processing",
        validation_status: "processing",
        credits_consumed: true,
      })
      .eq("id", jobId);

    if (updateError) {
      console.error("[generate-3d] Failed to update job status:", updateError);
      throw new Error("Failed to update job status");
    }

    const pipeline = PIPELINE_INFO[modelType] || PIPELINE_INFO.FALLBACK_MODEL;
    console.log(`[generate-3d] Using pipeline: ${pipeline.name}`);

    // =========================================================
    // TODO: Integrate with Image-to-3D API here
    // 
    // Based on modelType, select appropriate pipeline:
    // - HEAD_MODEL: Face NeRF / photogrammetry
    // - BUILDING_MODEL: Depth + photogrammetry
    // - ANIMAL_MODEL: Mesh reconstruction + pose normalization
    // - FALLBACK_MODEL: Object-centric photogrammetry + mesh cleanup
    //
    // API Options: Meshy.ai, Tripo3D, Replicate (TripoSR), etc.
    // 
    // Expected outputs:
    // - 3D model (GLB + OBJ)
    // - PNG preview render
    // - Quality report
    // - Notes on reconstruction issues
    // =========================================================

    console.log("[generate-3d] TODO: Implement actual 3D API integration");
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update job as completed (placeholder)
    const { error: completeError } = await supabase
      .from("figurine_jobs")
      .update({ 
        status: "completed",
        validation_status: "completed",
        // model_url will be set when real API is integrated
        // preview_url will be set when real API is integrated
      })
      .eq("id", jobId);

    if (completeError) {
      console.error("[generate-3d] Failed to complete job:", completeError);
      throw new Error("Failed to complete job");
    }

    console.log(`[generate-3d] Job ${jobId} completed successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        jobId,
        pipeline: pipeline.name,
        message: `Job processed with ${pipeline.name}. TODO: Integrate 3D API.`
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("[generate-3d] Error:", error);

    // If error occurs, try to mark job as failed
    try {
      const { jobId } = await req.clone().json();
      if (jobId) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from("figurine_jobs")
          .update({ 
            status: "failed",
            validation_status: "failed",
            error_message: error instanceof Error ? error.message : "Unknown error",
            // Don't consume credits on failure
            credits_consumed: false,
          })
          .eq("id", jobId);
      }
    } catch (e) {
      console.error("[generate-3d] Failed to update job on error:", e);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});