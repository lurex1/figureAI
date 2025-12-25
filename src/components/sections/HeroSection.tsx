import { motion } from "framer-motion";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { WorkflowDiagram } from "./WorkflowDiagram";
import { Floating3DShapes } from "@/components/ui/Floating3DShapes";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px]" />
      
      {/* Floating 3D shapes */}
      <Floating3DShapes />
      <div className="container relative z-10 px-4 py-20">
        <div className="flex flex-col gap-16 items-center">
          {/* Top content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered 3D Generation</span>
            </motion.div>
            
            <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Turn Photos Into{" "}
              <span className="gradient-text">3D Figurines</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Upload a single photo and watch AI transform it into a printable 3D figurine. 
              Choose from multiple styles and download ready-to-print STL files.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/create">
                  <Upload className="w-5 h-5" />
                  Start Creating
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Workflow Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            <WorkflowDiagram />
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex gap-8 justify-center"
          >
            {[
              { value: "10K+", label: "Models Created" },
              { value: "4", label: "Unique Styles" },
              { value: "99%", label: "Print Success" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-mono font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}