import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X, RotateCcw, Eye, Loader2, AlertCircle, Download } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ModelViewer } from "@/components/3d/ModelViewer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FigurineJob {
  id: string;
  original_image_url: string;
  style: string;
  status: string;
  model_url: string | null;
  preview_url: string | null;
  user_confirmed: boolean;
  created_at: string;
}

export default function ModelReviewPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [job, setJob] = useState<FigurineJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!jobId) {
      navigate("/dashboard");
      return;
    }

    const fetchJob = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("figurine_jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Job not found",
          description: "The requested model could not be found.",
        });
        navigate("/dashboard");
        return;
      }

      setJob(data);
      setIsLoading(false);
    };

    fetchJob();

    // Poll for updates if processing
    const interval = setInterval(async () => {
      if (job?.status === "processing") {
        const { data } = await supabase
          .from("figurine_jobs")
          .select("*")
          .eq("id", jobId)
          .single();
        
        if (data && data.status !== "processing") {
          setJob(data);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [jobId, navigate, toast]);

  const handleApprove = async () => {
    if (!job) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("figurine_jobs")
        .update({ 
          user_confirmed: true,
          status: "approved"
        })
        .eq("id", job.id);

      if (error) throw error;

      toast({
        title: "Model approved!",
        description: "Your 3D model has been saved to your dashboard.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        variant: "destructive",
        title: "Approval failed",
        description: "Could not approve the model. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!job) return;

    setIsSubmitting(true);
    try {
      // Refund credits
      if (user) {
        await supabase.rpc("add_credits", { 
          p_user_id: user.id, 
          p_amount: 5 
        });
      }

      const { error } = await supabase
        .from("figurine_jobs")
        .update({ 
          user_confirmed: false,
          status: "rejected",
          rejection_reason: "User rejected the model"
        })
        .eq("id", job.id);

      if (error) throw error;

      toast({
        title: "Model rejected",
        description: "Your credits have been refunded. Try generating a new model.",
      });
      
      navigate("/upload");
    } catch (error) {
      console.error("Rejection error:", error);
      toast({
        variant: "destructive",
        title: "Rejection failed",
        description: "Could not reject the model. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your model...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  const isProcessing = job.status === "processing" || job.status === "pending";
  const isFailed = job.status === "failed";
  const isReady = job.status === "completed" && job.model_url;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="font-mono text-3xl md:text-4xl font-bold mb-4">
              Review Your <span className="gradient-text">3D Model</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isProcessing 
                ? "Your model is being generated. This may take a few minutes..."
                : isReady
                  ? "Rotate and zoom to inspect your model. Accept it or request a new generation."
                  : "There was an issue with your model."}
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 3D Viewer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <GlassCard className="h-[500px] p-0 overflow-hidden relative">
                  {isProcessing ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-16 h-16 animate-spin text-primary" />
                      <div className="text-center">
                        <p className="font-medium mb-1">Generating your model...</p>
                        <p className="text-sm text-muted-foreground">This usually takes 2-5 minutes</p>
                      </div>
                    </div>
                  ) : isFailed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <AlertCircle className="w-16 h-16 text-destructive" />
                      <div className="text-center">
                        <p className="font-medium mb-1">Generation failed</p>
                        <p className="text-sm text-muted-foreground">Your credits have been refunded</p>
                      </div>
                    </div>
                  ) : (
                    <ModelViewer 
                      className="w-full h-full" 
                      modelUrl={job.model_url}
                      autoRotate={true}
                    />
                  )}
                </GlassCard>
                
                {isReady && (
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Drag to rotate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>Scroll to zoom</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Details & Actions Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassCard className="h-full flex flex-col">
                  <h3 className="font-mono text-lg font-semibold mb-6">Model Details</h3>
                  
                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">Style</span>
                      <span className="font-medium capitalize">{job.style}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-medium capitalize ${
                        isReady ? "text-primary" : isFailed ? "text-destructive" : "text-accent"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium">GLB / STL</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Source image thumbnail */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium mb-3">Source Image</h4>
                    <div className="aspect-square rounded-lg overflow-hidden bg-secondary w-24">
                      <img 
                        src={job.original_image_url} 
                        alt="Source" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  {isReady && (
                    <div className="space-y-3">
                      <Button 
                        variant="hero" 
                        size="lg" 
                        className="w-full" 
                        onClick={handleApprove}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Accept Model
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full text-destructive hover:text-destructive" 
                        onClick={handleReject}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <X className="w-5 h-5" />
                            Reject & Refund
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Rejecting will refund your 5 credits
                      </p>
                    </div>
                  )}

                  {isFailed && (
                    <div className="space-y-3">
                      <Button 
                        variant="hero" 
                        size="lg" 
                        className="w-full" 
                        onClick={() => navigate("/upload")}
                      >
                        Try Again
                      </Button>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="text-center text-sm text-muted-foreground">
                      <p>Please wait while we generate your model.</p>
                      <p>You can leave this page - we'll save your model automatically.</p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
