import { motion } from "framer-motion";
import { Camera, Sparkles, Code, Printer } from "lucide-react";

const steps = [
  {
    icon: Camera,
    label: "Zdjęcie",
    description: "Zrób zdjęcie",
  },
  {
    icon: Sparkles,
    label: "AI",
    description: "Analiza AI",
  },
  {
    icon: Code,
    label: "Model",
    description: "Generowanie 3D",
  },
  {
    icon: Printer,
    label: "Druk",
    description: "Drukarka 3D",
  },
];

export function WorkflowDiagram() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl" />
      
      <div className="relative glass-card p-8 rounded-3xl">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }}
              className="flex flex-col items-center flex-1"
            >
              {/* Icon container */}
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-colors" />
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-secondary/80 border border-border/50 flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 group-hover:scale-105">
                  <step.icon className="w-7 h-7 md:w-9 md:h-9 text-primary" />
                </div>
              </div>
              
              {/* Labels */}
              <div className="mt-4 text-center">
                <div className="font-mono text-sm md:text-base font-semibold text-foreground">
                  {step.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {step.description}
                </div>
              </div>
              
              {/* Arrow (not after last item) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.6 + index * 0.15, duration: 0.4 }}
                  className="absolute hidden md:block"
                  style={{
                    left: `calc(${(index + 1) * 25}% - 1rem)`,
                    top: "2.5rem",
                  }}
                >
                  <svg
                    width="32"
                    height="16"
                    viewBox="0 0 32 16"
                    fill="none"
                    className="text-primary/60"
                  >
                    <path
                      d="M0 8H28M28 8L22 2M28 8L22 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Connecting line for mobile */}
        <div className="absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 md:hidden" />
      </div>
    </div>
  );
}
