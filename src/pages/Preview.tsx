import { motion } from "framer-motion";
import { Download, RotateCcw, ShoppingCart, Eye } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ModelViewer } from "@/components/3d/ModelViewer";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const style = location.state?.style || "realistic";
  const image = location.state?.image;

  const handleDownload = () => {
    toast({
      title: "Purchase Required",
      description: "Please purchase credits to download your 3D model.",
    });
    navigate("/pricing");
  };

  const handleNewModel = () => {
    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-mono text-3xl md:text-4xl font-bold mb-4">
              Your <span className="gradient-text">3D Model</span>
            </h1>
            <p className="text-muted-foreground">
              Preview your generated figurine in 3D. Rotate and zoom to inspect.
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
                <GlassCard className="h-[500px] p-0 overflow-hidden">
                  <ModelViewer className="w-full h-full" />
                </GlassCard>
                
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
              </motion.div>

              {/* Details panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassCard className="h-full">
                  <h3 className="font-mono text-lg font-semibold mb-6">Model Details</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">Style</span>
                      <span className="font-medium capitalize">{style}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium">STL + OBJ</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">Base</span>
                      <span className="font-medium">Round plate</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">Quality</span>
                      <span className="font-medium">Print-ready</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-medium">~15cm tall</span>
                    </div>
                  </div>

                  {/* Source image thumbnail */}
                  {image && (
                    <div className="mb-8">
                      <h4 className="text-sm font-medium mb-3">Source Image</h4>
                      <div className="aspect-square rounded-lg overflow-hidden bg-secondary w-24">
                        <img src={image} alt="Source" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button variant="hero" size="lg" className="w-full" onClick={handleDownload}>
                      <ShoppingCart className="w-5 h-5" />
                      Download ($9)
                    </Button>
                    <Button variant="outline" size="lg" className="w-full" onClick={handleNewModel}>
                      Create New Model
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Free PNG preview available. Purchase to download STL/OBJ files.
                  </p>
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
