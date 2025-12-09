import { motion } from "framer-motion";
import { Upload, Wand2, Eye, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Photo",
    description: "Upload a clear front-facing photo of your subject",
  },
  {
    icon: Wand2,
    title: "Choose Style",
    description: "Select from Realistic, Anime, LEGO, or Fortnite styles",
  },
  {
    icon: Eye,
    title: "Preview 3D",
    description: "View your generated 3D model in real-time",
  },
  {
    icon: Download,
    title: "Download",
    description: "Get your print-ready STL and OBJ files",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From photo to printable figurine in just four simple steps
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-6 group-hover:border-primary/50 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-mono text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
