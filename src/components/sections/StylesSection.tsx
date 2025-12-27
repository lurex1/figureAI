import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

import styleRealistic from "@/assets/style-realistic.png";
import styleAnime from "@/assets/style-anime.png";
import styleLego from "@/assets/style-lego.png";
import styleFortnite from "@/assets/style-fortnite.png";

const styles = [
  {
    id: "realistic",
    name: "Realistic",
    description: "Realistyczny, szczegółowy model 3D z dokładnymi proporcjami",
    image: styleRealistic,
  },
  {
    id: "anime",
    name: "Anime",
    description: "Stylizacja anime z ekspresyjnymi cechami i dużymi oczami",
    image: styleAnime,
  },
  {
    id: "lego",
    name: "LEGO",
    description: "Klocki w stylu klasycznych figurek LEGO",
    image: styleLego,
  },
  {
    id: "fortnite",
    name: "Fortnite",
    description: "Stylizacja low-poly z gry Fortnite",
    image: styleFortnite,
  },
];

export function StylesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="gradient-text">Style</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your photos into unique figurines with our AI-powered style engines
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {styles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer group p-0 overflow-hidden">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img 
                    src={style.image} 
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-mono text-xl font-semibold mb-2">{style.name}</h3>
                  <p className="text-sm text-muted-foreground">{style.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
