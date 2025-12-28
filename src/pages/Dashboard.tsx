import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box, Clock, Download, Eye, Plus, Loader2, Coins, XCircle, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface FigurineJob {
  id: string;
  original_image_url: string;
  style: string;
  status: string;
  model_url: string | null;
  preview_url: string | null;
  error_message: string | null;
  user_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<FigurineJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingJobId, setCancellingJobId] = useState<string | null>(null);

  const cancelJob = async (jobId: string) => {
    setCancellingJobId(jobId);
    try {
      const { error } = await supabase
        .from("figurine_jobs")
        .update({ 
          status: "failed", 
          error_message: "Cancelled by user",
          updated_at: new Date().toISOString()
        })
        .eq("id", jobId);

      if (error) throw error;

      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: "failed", error_message: "Cancelled by user" } 
          : job
      ));

      toast({
        title: "Job cancelled",
        description: "The generation job has been cancelled.",
      });
    } catch (error) {
      console.error("Failed to cancel job:", error);
      toast({
        title: "Failed to cancel",
        description: "Could not cancel the job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancellingJobId(null);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchJobs = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("figurine_jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setJobs(data);
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, [user, navigate]);

  const getStatusBadge = (job: FigurineJob) => {
    if (job.status === "completed" && job.user_confirmed) {
      return { label: "Ready", className: "bg-primary/20 text-primary" };
    }
    if (job.status === "completed" && !job.user_confirmed) {
      return { label: "Review", className: "bg-accent/20 text-accent" };
    }
    if (job.status === "processing" || job.status === "pending") {
      return { label: "Processing", className: "bg-accent/20 text-accent" };
    }
    if (job.status === "approved") {
      return { label: "Approved", className: "bg-primary/20 text-primary" };
    }
    if (job.status === "rejected") {
      return { label: "Rejected", className: "bg-destructive/20 text-destructive" };
    }
    if (job.status === "failed") {
      return { label: "Failed", className: "bg-destructive/20 text-destructive" };
    }
    return { label: job.status, className: "bg-muted text-muted-foreground" };
  };

  const handleViewJob = (job: FigurineJob) => {
    if (job.status === "completed" && !job.user_confirmed) {
      navigate(`/review/${job.id}`);
    } else if (job.status === "approved" || (job.status === "completed" && job.user_confirmed)) {
      navigate(`/preview/${job.id}`);
    } else if (job.status === "processing" || job.status === "pending") {
      navigate(`/review/${job.id}`);
    }
  };

  const completedJobs = jobs.filter(j => j.status === "approved" || (j.status === "completed" && j.user_confirmed));
  const pendingReviewJobs = jobs.filter(j => j.status === "completed" && !j.user_confirmed);
  const processingJobs = jobs.filter(j => j.status === "processing" || j.status === "pending");
  const failedJobs = jobs.filter(j => j.status === "failed");

  // Check for stuck jobs (processing for more than 10 minutes)
  const stuckJobs = processingJobs.filter(job => {
    const updatedAt = new Date(job.updated_at).getTime();
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
    return updatedAt < tenMinutesAgo;
  });
  const lastCreatedDate = jobs.length > 0 
    ? new Date(jobs[0].created_at).toLocaleDateString() 
    : "Never";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12"
          >
            <div>
              <h1 className="font-mono text-3xl md:text-4xl font-bold mb-2">
                Your <span className="gradient-text">Models</span>
              </h1>
              <p className="text-muted-foreground">
                View and manage your generated 3D figurines
              </p>
            </div>
            
            <Button variant="hero" asChild>
              <Link to="/upload">
                <Plus className="w-5 h-5" />
                Create New
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="grid sm:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Models", value: completedJobs.length.toString(), icon: Box },
              { label: "Credits", value: subscription.creditsBalance.toString(), icon: Coins },
              { label: "Pending Review", value: pendingReviewJobs.length.toString(), icon: Eye },
              { label: "Last Created", value: lastCreatedDate, icon: Clock },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-mono font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Pending Review Alert */}
          {pendingReviewJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <GlassCard className="border-accent/50 bg-accent/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">You have {pendingReviewJobs.length} model(s) waiting for review</p>
                      <p className="text-sm text-muted-foreground">Accept or reject your generated models</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate(`/review/${pendingReviewJobs[0].id}`)}>
                    Review Now
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Stuck Jobs Alert */}
          {stuckJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <GlassCard className="border-destructive/50 bg-destructive/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-medium">You have {stuckJobs.length} stuck job(s)</p>
                      <p className="text-sm text-muted-foreground">These jobs have been processing for too long and may have failed</p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => stuckJobs.forEach(job => cancelJob(job.id))}
                    disabled={cancellingJobId !== null}
                  >
                    {cancellingJobId ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}
                    Cancel All
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Models grid */}
          {!isLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, i) => {
                const status = getStatusBadge(job);
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <GlassCard className="overflow-hidden p-0 group">
                      {/* Thumbnail */}
                      <div className="aspect-square relative overflow-hidden bg-secondary">
                        <img
                          src={job.preview_url || job.original_image_url}
                          alt="Model preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        
                        {/* Status badge */}
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                          {status.label}
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          {job.status === "failed" ? (
                            <Button variant="hero" size="sm" asChild>
                              <Link to="/upload">
                                <Plus className="w-4 h-4" />
                                Try Again
                              </Link>
                            </Button>
                          ) : (job.status === "processing" || job.status === "pending") ? (
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => cancelJob(job.id)}
                              disabled={cancellingJobId === job.id}
                            >
                              {cancellingJobId === job.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              Cancel
                            </Button>
                          ) : (
                            <>
                              <Button variant="hero" size="sm" onClick={() => handleViewJob(job)}>
                                <Eye className="w-4 h-4" />
                                {job.status === "completed" && !job.user_confirmed ? "Review" : "View"}
                              </Button>
                              {(job.status === "approved" || job.user_confirmed) && job.model_url && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={job.model_url} download>
                                    <Download className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-medium mb-1 capitalize">{job.style} Style</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="capitalize">{job.status}</span>
                          <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        {job.status === "failed" && job.error_message && (
                          <p className="text-xs text-destructive mt-1 truncate" title={job.error_message}>
                            {job.error_message}
                          </p>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}

              {/* Empty state / CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link to="/upload" className="block h-full">
                  <GlassCard className="h-full min-h-[300px] flex flex-col items-center justify-center border-dashed hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-2">Create New Model</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Upload a photo to generate<br />your next figurine
                    </p>
                  </GlassCard>
                </Link>
              </motion.div>
            </div>
          )}

          {/* No models yet */}
          {!isLoading && jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Box className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-medium mb-2">No models yet</h3>
              <p className="text-muted-foreground mb-6">Create your first 3D figurine from a photo</p>
              <Button variant="hero" asChild>
                <Link to="/upload">
                  <Plus className="w-5 h-5" />
                  Create Your First Model
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
