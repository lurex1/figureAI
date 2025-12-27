import { motion } from "framer-motion";
import { Box, Clock, Download, Eye, Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Link } from "react-router-dom";

import styleRealistic from "@/assets/style-realistic.png";
import styleAnime from "@/assets/style-anime.png";
import styleLego from "@/assets/style-lego.png";

// Mock data for demonstration - te dane będą pobierane z bazy po generacji
const mockModels = [
  {
    id: "1",
    name: "Moja figurka",
    style: "Realistic",
    createdAt: "2024-01-15",
    status: "completed",
    thumbnail: styleRealistic,
  },
  {
    id: "2",
    name: "Postać anime",
    style: "Anime",
    createdAt: "2024-01-14",
    status: "completed",
    thumbnail: styleAnime,
  },
  {
    id: "3",
    name: "LEGO figurka",
    style: "LEGO",
    createdAt: "2024-01-13",
    status: "processing",
    thumbnail: styleLego,
  },
];

export default function DashboardPage() {
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
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Total Models", value: "3", icon: Box },
              { label: "Credits Remaining", value: "2", icon: Download },
              { label: "Last Created", value: "2 days ago", icon: Clock },
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

          {/* Models grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockModels.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard className="overflow-hidden p-0 group">
                  {/* Thumbnail */}
                  <div className="aspect-square relative overflow-hidden bg-secondary">
                    <img
                      src={model.thumbnail}
                      alt={model.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Status badge */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                      model.status === "completed" 
                        ? "bg-primary/20 text-primary" 
                        : "bg-accent/20 text-accent"
                    }`}>
                      {model.status === "completed" ? "Ready" : "Processing"}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Button variant="hero" size="sm">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      {model.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{model.name}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{model.style}</span>
                      <span>{model.createdAt}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

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
        </div>
      </main>
      <Footer />
    </div>
  );
}
