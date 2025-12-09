import { CheckCircle, XCircle, AlertTriangle, Camera, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { JobData, AnalysisResult } from "@/hooks/useImageAnalysis";

interface AnalysisResultStepProps {
  jobData: JobData;
  onConfirmFallback: () => void;
  onAddImage: (file: File) => void;
  onProceed: () => void;
  onRetry: () => void;
  isGenerating?: boolean;
}

const MODEL_TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  HEAD_MODEL: { label: "Human Head", icon: "👤", color: "text-blue-500" },
  BUILDING_MODEL: { label: "Building", icon: "🏛️", color: "text-amber-500" },
  ANIMAL_MODEL: { label: "Animal", icon: "🐾", color: "text-green-500" },
  FALLBACK_MODEL: { label: "Object", icon: "📦", color: "text-purple-500" },
};

export function AnalysisResultStep({
  jobData,
  onConfirmFallback,
  onAddImage,
  onProceed,
  onRetry,
  isGenerating,
}: AnalysisResultStepProps) {
  const analysis = jobData.quality_report as AnalysisResult | null;
  const status = jobData.validation_status;
  const modelType = jobData.model_type;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAddImage(e.target.files[0]);
    }
  };

  // Rejected
  if (status === "rejected") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Image Cannot Be Processed</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {analysis?.rejection_reason || "This image cannot be processed. Please upload a clearer photo."}
          </p>
        </div>

        {analysis?.quality_issues && analysis.quality_issues.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Quality Issues Detected
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {analysis.quality_issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>No credits were consumed.</strong> Try uploading a different image.
          </p>
        </div>

        <Button onClick={onRetry} className="w-full">
          Try Another Image
        </Button>
      </div>
    );
  }

  // Needs more images
  if (status === "needs_more_images") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Additional Image Required</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {analysis?.additional_image_request || "Please provide an additional angle for better 3D reconstruction."}
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center gap-4">
            <img
              src={jobData.original_image_url}
              alt="Uploaded"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <p className="font-medium text-foreground">
                {MODEL_TYPE_LABELS[modelType || ""]?.icon} {MODEL_TYPE_LABELS[modelType || ""]?.label || "Unknown"}
              </p>
              <p className="text-sm text-muted-foreground">{analysis?.detected_object}</p>
            </div>
          </div>
        </div>

        <div className="relative border-2 border-dashed border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center">
            <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-foreground font-medium">Upload Additional Angle</p>
            <p className="text-sm text-muted-foreground">Click or drag to add</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>No credits consumed yet.</strong> Credits will only be used when you start generation.
          </p>
        </div>
      </div>
    );
  }

  // Awaiting confirmation (Fallback model)
  if (status === "awaiting_confirmation" && !jobData.user_confirmed) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Object Detected</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We detected an object that can be converted to a 3D model. Please confirm to proceed.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center gap-4">
            <img
              src={jobData.original_image_url}
              alt="Uploaded"
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-medium text-foreground text-lg">
                📦 {analysis?.detected_object || "Unknown Object"}
              </p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Quality Score</span>
                  <span className="text-foreground">{Math.round((analysis?.quality_score || 0) * 100)}%</span>
                </div>
                <Progress value={(analysis?.quality_score || 0) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <strong>Confirmation Required:</strong> We can generate a 3D model of this {analysis?.detected_object?.toLowerCase() || "object"}. 
            Do you want to proceed?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onRetry}>
            Try Different Image
          </Button>
          <Button onClick={onConfirmFallback}>
            Yes, Create 3D Model
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>No credits consumed yet.</strong> Credits will only be used after you confirm.
          </p>
        </div>
      </div>
    );
  }

  // Approved - Ready to generate
  if (status === "approved" || jobData.user_confirmed) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Generate!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your image has been analyzed and is ready for 3D model generation.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center gap-4">
            <img
              src={jobData.original_image_url}
              alt="Uploaded"
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className={cn(
                "font-medium text-lg",
                MODEL_TYPE_LABELS[modelType || ""]?.color || "text-foreground"
              )}>
                {MODEL_TYPE_LABELS[modelType || ""]?.icon} {MODEL_TYPE_LABELS[modelType || ""]?.label || "Model"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{analysis?.detected_object}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Quality Score</span>
                  <span className="text-foreground">{Math.round((analysis?.quality_score || 0) * 100)}%</span>
                </div>
                <Progress value={(analysis?.quality_score || 0) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        {analysis?.recommendation && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 {analysis.recommendation}
            </p>
          </div>
        )}

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-center">
            <strong>Credits will be consumed</strong> when you start the 3D generation process.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onRetry}>
            Start Over
          </Button>
          <Button onClick={onProceed} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Generate 3D Model"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Default / Loading
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
