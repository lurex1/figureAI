import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Palette, Box, Gamepad2 } from "lucide-react";

const styles = [
  {
    id: "realistic",
    name: "Realistic",
    description: "Highly detailed, lifelike 3D model with accurate proportions",
    icon: User,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "anime",
    name: "Anime",
    description: "Stylized anime aesthetics with expressive features",
    icon: Palette,
    gradient: "from-pink-500 to-purple-500",
  },
  {
    id: "lego",
    name: "LEGO",
    description: "Block-style design inspired by classic brick figures",
    icon: Box,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    id: "fortnite",
    name: "Fortnite",
    description: "Low-poly stylized look with vibrant game aesthetics",
    icon: Gamepad2,
    gradient: "from-green-500 to-teal-500",
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
              <GlassCard className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <style.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="font-mono text-xl font-semibold mb-2">{style.name}</h3>
                <p className="text-sm text-muted-foreground">{style.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
