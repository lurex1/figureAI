import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Image, ArrowRight, X, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useFigurineJob, FigurineStyle } from "@/hooks/useFigurineJob";

import styleRealistic from "@/assets/style-realistic.png";
import styleAnime from "@/assets/style-anime.png";
import styleLego from "@/assets/style-lego.png";
import styleFortnite from "@/assets/style-fortnite.png";

const styles = [
  { id: "realistic", name: "Realistic", image: styleRealistic, description: "Realistyczny, szczegółowy model 3D" },
  { id: "anime", name: "Anime", image: styleAnime, description: "Stylizacja anime z dużymi oczami" },
  { id: "lego", name: "LEGO", image: styleLego, description: "Klocki w stylu LEGO" },
  { id: "fortnite", name: "Fortnite", image: styleFortnite, description: "Stylizacja z gry Fortnite" },
];

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<FigurineStyle | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadImage, createJob, isUploading, isGenerating } = useFigurineJob();

  const isProcessing = isUploading || isGenerating;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !selectedStyle) return;

    // Upload image to storage
    const imageUrl = await uploadImage(selectedFile);
    if (!imageUrl) return;

    // Create job and trigger generation
    const job = await createJob(imageUrl, selectedStyle);
    if (!job) return;

    // Navigate to preview with job ID
    navigate("/preview", { state: { jobId: job.id, style: selectedStyle, image: preview } });
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setSelectedStyle(null);
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
              Create Your <span className="gradient-text">Figurine</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Upload a clear front-facing photo and choose your preferred style
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Upload area */}
            {!preview ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <label
                  htmlFor="file-upload"
                  className={`block cursor-pointer`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <GlassCard
                    className={`py-16 text-center transition-all duration-300 ${
                      dragActive ? "border-primary scale-[1.02]" : "hover:border-primary/50"
                    }`}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-mono text-xl font-semibold mb-2">
                      {dragActive ? "Drop your image here" : "Upload your photo"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Drag and drop or click to browse
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Image className="w-4 h-4" />
                      <span>JPG, PNG up to 10MB</span>
                    </div>
                  </GlassCard>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <GlassCard className="relative">
                  <button
                    onClick={clearSelection}
                    disabled={isProcessing}
                    className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-destructive/20 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Preview */}
                    <div>
                      <h3 className="font-mono text-lg font-semibold mb-4">Your Photo</h3>
                      <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Style selection */}
                    <div>
                      <h3 className="font-mono text-lg font-semibold mb-4">Choose Style</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {styles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id as FigurineStyle)}
                            disabled={isProcessing}
                            className={`p-3 rounded-xl border transition-all duration-200 text-left disabled:opacity-50 overflow-hidden ${
                              selectedStyle === style.id
                                ? "border-primary bg-primary/10 ring-2 ring-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-secondary">
                              <img 
                                src={style.image} 
                                alt={style.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-medium text-sm">{style.name}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{style.description}</p>
                          </button>
                        ))}
                      </div>

                      <Button
                        variant="hero"
                        size="lg"
                        className="w-full mt-6"
                        disabled={!selectedStyle || isProcessing}
                        onClick={handleGenerate}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {isUploading ? "Uploading..." : "Processing..."}
                          </>
                        ) : (
                          <>
                            Generate 3D Model
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
