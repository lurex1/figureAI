import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANALYSIS_PROMPT = `You are an AI image analyzer for a 3D model generation service. Analyze the uploaded image and determine if it can be converted into a 3D model.

CLASSIFICATION RULES:
1. HEAD_MODEL - Human head/face photos
   - Requires: Clear frontal or side view of a human head
   - Check: Face visibility, lighting quality, no obstructions
   
2. BUILDING_MODEL - Architecture/buildings
   - Requires: Visible structure edges and building shape
   - Check: Not heavily distorted, clear geometry visible
   
3. ANIMAL_MODEL - Animals
   - Requires: Full body visible including head and legs
   - Check: Not cropped, animal clearly identifiable
   
4. FALLBACK_MODEL - Other clear objects
   - Use when: Image doesn't fit above categories BUT contains ONE clear, dominant object
   - Examples: bicycle, backpack, toy, chair, car, statue, tool, device
   - Check: Object has clear geometry, is centered, and can be 3D reconstructed
   
5. REJECT_IMAGE - Cannot be processed
   - Use when: Image is too blurred, too dark, has overlapping objects, incorrectly cropped, or no clear subject

RESPONSE FORMAT (JSON only, no markdown):
{
  "classification": "HEAD_MODEL" | "BUILDING_MODEL" | "ANIMAL_MODEL" | "FALLBACK_MODEL" | "REJECT_IMAGE",
  "confidence": 0.0-1.0,
  "detected_object": "description of what was detected",
  "quality_score": 0.0-1.0,
  "quality_issues": ["list of any quality issues"],
  "needs_additional_images": boolean,
  "additional_image_request": "what additional angle is needed if any",
  "rejection_reason": "reason if rejected, null otherwise",
  "can_proceed": boolean,
  "recommendation": "brief recommendation for the user"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, imageUrl } = await req.json();
    
    console.log(`[analyze-image] Starting analysis for job ${jobId}`);
    console.log(`[analyze-image] Image URL: ${imageUrl}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update job status to analyzing
    await supabase
      .from("figurine_jobs")
      .update({ validation_status: "analyzing" })
      .eq("id", jobId);

    if (!lovableApiKey) {
      console.error("[analyze-image] LOVABLE_API_KEY not configured");
      throw new Error("AI service not configured");
    }

    // Call Lovable AI for image analysis
    console.log("[analyze-image] Calling AI for image analysis...");
    
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: ANALYSIS_PROMPT },
          { 
            role: "user", 
            content: [
              { type: "text", text: "Analyze this image and classify it for 3D model generation. Respond with JSON only." },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("[analyze-image] AI API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (aiResponse.status === 402) {
        throw new Error("AI service credits exhausted.");
      }
      throw new Error("Failed to analyze image");
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices?.[0]?.message?.content;
    
    console.log("[analyze-image] AI response:", analysisText);

    // Parse the JSON response
    let analysis;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanedText = analysisText.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
      }
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
      }
      analysis = JSON.parse(cleanedText.trim());
    } catch (parseError) {
      console.error("[analyze-image] Failed to parse AI response:", parseError);
      analysis = {
        classification: "REJECT_IMAGE",
        confidence: 0,
        detected_object: "Unknown",
        quality_score: 0,
        quality_issues: ["Failed to analyze image"],
        needs_additional_images: false,
        additional_image_request: null,
        rejection_reason: "Image analysis failed. Please try a different image.",
        can_proceed: false,
        recommendation: "Please upload a clearer image."
      };
    }

    // Determine validation status based on analysis
    let validationStatus = "pending";
    if (analysis.classification === "REJECT_IMAGE") {
      validationStatus = "rejected";
    } else if (analysis.needs_additional_images) {
      validationStatus = "needs_more_images";
    } else if (analysis.classification === "FALLBACK_MODEL") {
      validationStatus = "awaiting_confirmation";
    } else if (analysis.can_proceed) {
      validationStatus = "approved";
    }

    // Update job with analysis results
    const { error: updateError } = await supabase
      .from("figurine_jobs")
      .update({
        model_type: analysis.classification !== "REJECT_IMAGE" ? analysis.classification : null,
        validation_status: validationStatus,
        detected_object: analysis.detected_object,
        quality_report: analysis,
        rejection_reason: analysis.rejection_reason,
        credits_consumed: false, // Credits not consumed during analysis
      })
      .eq("id", jobId);

    if (updateError) {
      console.error("[analyze-image] Failed to update job:", updateError);
      throw new Error("Failed to save analysis results");
    }

    console.log(`[analyze-image] Job ${jobId} analyzed: ${analysis.classification}`);

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        analysis,
        validationStatus,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[analyze-image] Error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
