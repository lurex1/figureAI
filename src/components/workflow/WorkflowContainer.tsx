import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUploadStep } from "./ImageUploadStep";
import { AnalysisResultStep } from "./AnalysisResultStep";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import { GlassCard } from "@/components/ui/glass-card";

export function WorkflowContainer() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"upload" | "result">("upload");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    isUploading,
    isAnalyzing,
    jobData,
    uploadAndAnalyze,
    confirmFallback,
    addAdditionalImage,
    startGeneration,
    resetAnalysis,
  } = useImageAnalysis();

  const handleUpload = async (file: File) => {
    try {
      await uploadAndAnalyze(file, "realistic");
      setStep("result");
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleConfirmFallback = async () => {
    if (jobData) {
      await confirmFallback(jobData.id);
    }
  };

  const handleAddImage = async (file: File) => {
    if (jobData) {
      await addAdditionalImage(jobData.id, file);
    }
  };

  const handleProceed = async () => {
    if (jobData) {
      setIsGenerating(true);
      try {
        await startGeneration(jobData.id);
        navigate(`/preview/${jobData.id}`);
      } catch (error) {
        setIsGenerating(false);
      }
    }
  };

  const handleRetry = () => {
    resetAnalysis();
    setStep("upload");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === "upload" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === "upload" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              1
            </div>
            <span className="hidden sm:inline">Upload</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === "result" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === "result" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
            <span className="hidden sm:inline">Review</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="hidden sm:inline">Generate</span>
          </div>
        </div>

        {/* Main content */}
        <GlassCard className="p-8">
          {step === "upload" && (
            <ImageUploadStep
              onUpload={handleUpload}
              isUploading={isUploading}
              isAnalyzing={isAnalyzing}
            />
          )}

          {step === "result" && jobData && (
            <AnalysisResultStep
              jobData={jobData}
              onConfirmFallback={handleConfirmFallback}
              onAddImage={handleAddImage}
              onProceed={handleProceed}
              onRetry={handleRetry}
              isGenerating={isGenerating}
            />
          )}
        </GlassCard>

        {/* Info footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Your photos are processed securely. Credits are only consumed when 3D generation starts.
          </p>
        </div>
      </div>
    </div>
  );
}
