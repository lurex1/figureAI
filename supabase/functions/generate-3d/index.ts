import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map internal model types to Meshy style presets
const STYLE_MAP: Record<string, string> = {
  realistic: "realistic",
  anime: "cartoon",
  lego: "voxel",
  fortnite: "cartoon",
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
    const meshyApiKey = Deno.env.get("MESHY_API_KEY");
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!meshyApiKey) {
      throw new Error("MESHY_API_KEY is not configured");
    }

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

    // Verify the job is approved
    if (job.validation_status !== "approved" && !job.user_confirmed) {
      console.error("[generate-3d] Job not approved for generation");
      throw new Error("Job must be approved before generation");
    }

    // Update job status to processing
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

    // Create Meshy.ai Image-to-3D task
    console.log("[generate-3d] Creating Meshy.ai task...");
    
    const meshyStyle = STYLE_MAP[style] || "realistic";
    
    const createTaskResponse = await fetch("https://api.meshy.ai/v2/image-to-3d", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${meshyApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        enable_pbr: true,
        ai_model: "meshy-4",
        topology: "quad",
        target_polycount: 30000,
      }),
    });

    if (!createTaskResponse.ok) {
      const errorText = await createTaskResponse.text();
      console.error("[generate-3d] Meshy API error:", errorText);
      throw new Error(`Meshy API error: ${createTaskResponse.status} - ${errorText}`);
    }

    const createTaskData = await createTaskResponse.json();
    const meshyTaskId = createTaskData.result;
    
    console.log(`[generate-3d] Meshy task created: ${meshyTaskId}`);

    // Poll for task completion
    let taskComplete = false;
    let taskResult = null;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max (5s intervals)

    while (!taskComplete && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await fetch(`https://api.meshy.ai/v2/image-to-3d/${meshyTaskId}`, {
        headers: {
          "Authorization": `Bearer ${meshyApiKey}`,
        },
      });

      if (!statusResponse.ok) {
        console.error("[generate-3d] Failed to check task status");
        attempts++;
        continue;
      }

      taskResult = await statusResponse.json();
      console.log(`[generate-3d] Task status: ${taskResult.status} (attempt ${attempts + 1})`);

      if (taskResult.status === "SUCCEEDED") {
        taskComplete = true;
      } else if (taskResult.status === "FAILED" || taskResult.status === "EXPIRED") {
        throw new Error(`Meshy task failed: ${taskResult.task_error?.message || "Unknown error"}`);
      }

      attempts++;
    }

    if (!taskComplete) {
      throw new Error("Meshy task timed out");
    }

    console.log("[generate-3d] Meshy task completed successfully");
    console.log("[generate-3d] Model URLs:", taskResult.model_urls);

    // Update job with results
    const { error: completeError } = await supabase
      .from("figurine_jobs")
      .update({ 
        status: "completed",
        validation_status: "completed",
        model_url: taskResult.model_urls?.glb || taskResult.model_urls?.obj || null,
        preview_url: taskResult.thumbnail_url || null,
        quality_report: {
          meshy_task_id: meshyTaskId,
          model_urls: taskResult.model_urls,
          texture_urls: taskResult.texture_urls,
          created_at: taskResult.created_at,
          finished_at: taskResult.finished_at,
        },
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
        modelUrl: taskResult.model_urls?.glb,
        previewUrl: taskResult.thumbnail_url,
        message: "3D model generated successfully with Meshy.ai"
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
